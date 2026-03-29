import type { ProcessingResult } from "./file-processor"

export interface ExportOptions {
  format: "txt" | "pdf" | "docx" | "json"
  includeMetadata: boolean
  includeAuditTrail: boolean
  customFileName?: string
}

export class ExportManager {
  static async exportResult(result: ProcessingResult, options: ExportOptions): Promise<void> {
    const { format, includeMetadata, includeAuditTrail, customFileName } = options

    let content: string
    let mimeType: string
    let extension: string

    switch (format) {
      case "txt":
        content = this.generateTextExport(result, includeMetadata)
        mimeType = "text/plain"
        extension = "txt"
        break
      case "json":
        content = this.generateJSONExport(result, includeMetadata, includeAuditTrail)
        mimeType = "application/json"
        extension = "json"
        break
      case "pdf":
        content = this.generatePDFExport(result, includeMetadata)
        mimeType = "text/plain"
        extension = "txt"
        break
      case "docx":
        content = this.generateDocxExport(result, includeMetadata)
        mimeType = "text/plain"
        extension = "txt"
        break
      default:
        throw new Error(`Unsupported export format: ${format}`)
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
    const baseFileName = result.fileName.replace(/\.\w+$/, "")
    const fileName = customFileName || `${baseFileName}_redacted_${timestamp}.${extension}`
    this.downloadFile(content, fileName, mimeType)
  }

  static async exportBatch(results: ProcessingResult[], options: ExportOptions): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5)
    const batchData = {
      exportDate: new Date().toISOString(),
      exportTimestamp: timestamp,
      totalFiles: results.length,
      totalDetections: results.reduce((sum, r) => sum + r.detections.length, 0),
      activeRedactions: results.reduce((sum, r) => sum + r.detections.filter((d) => d.enabled).length, 0),
      successfulProcessing: results.filter((r) => r.status === "completed").length,
      failedProcessing: results.filter((r) => r.status === "error").length,
      averageConfidence:
        results.length > 0
          ? (results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 100
          : 0,
      totalProcessingTime: results.reduce((sum, r) => sum + r.processingTime, 0),
      results: results.map((result) => ({
        fileName: result.fileName,
        status: result.status,
        redactedText: result.redactedText,
        detections: result.detections.filter((d) => d.enabled),
        metadata: {
          processingTime: result.processingTime,
          confidence: result.confidence,
          fileSize: result.fileSize,
          fileType: result.fileType,
        },
        riskAnalysis: this.generateRiskAnalysis(result),
      })),
    }

    const content = JSON.stringify(batchData, null, 2)
    const fileName = `batch-redaction-export_${timestamp}.json`
    this.downloadFile(content, fileName, "application/json")
  }

  private static generateTextExport(result: ProcessingResult, includeMetadata: boolean): string {
    let content = result.redactedText

    if (includeMetadata) {
      const metadata = `
=== REDACTION METADATA ===
File: ${result.fileName}
Processing Time: ${result.processingTime.toFixed(2)}s
Confidence: ${(result.confidence * 100).toFixed(1)}%
Detections: ${result.detections.length}
Status: ${result.status}
Export Date: ${new Date().toISOString()}

=== REDACTED CONTENT ===
${content}

=== DETECTION SUMMARY ===
${result.detections
  .map(
    (d, i) =>
      `${i + 1}. ${d.type}: "${d.text}" → "${d.customRedaction || d.redacted}" (${(d.confidence * 100).toFixed(1)}% confidence, ${d.riskLevel} risk)`,
  )
  .join("\n")}
`
      content = metadata
    }

    return content
  }

  private static generateJSONExport(
    result: ProcessingResult,
    includeMetadata: boolean,
    includeAuditTrail: boolean,
  ): string {
    const exportData: any = {
      fileName: result.fileName,
      redactedText: result.redactedText,
      exportDate: new Date().toISOString(),
    }

    if (includeMetadata) {
      exportData.metadata = {
        originalFileName: result.fileName,
        fileSize: result.fileSize,
        fileType: result.fileType,
        processingTime: result.processingTime,
        confidence: result.confidence,
        status: result.status,
        detectionCount: result.detections.length,
        enabledDetections: result.detections.filter((d) => d.enabled).length,
      }

      exportData.riskAnalysis = this.generateRiskAnalysis(result)
    }

    if (includeAuditTrail) {
      exportData.auditTrail = {
        detections: result.detections.map((d) => ({
          id: d.id,
          type: d.type,
          originalText: d.text,
          redactedText: d.customRedaction || d.redacted,
          confidence: d.confidence,
          riskLevel: d.riskLevel,
          enabled: d.enabled,
          position: { start: d.start, end: d.end },
          context: {
            before: d.contextBefore,
            after: d.contextAfter,
          },
        })),
        processingSteps: [
          { step: "File Upload", timestamp: new Date().toISOString() },
          { step: "Text Extraction", timestamp: new Date().toISOString() },
          { step: "PII Detection", timestamp: new Date().toISOString() },
          { step: "Redaction Applied", timestamp: new Date().toISOString() },
          { step: "Export Generated", timestamp: new Date().toISOString() },
        ],
      }
    }

    return JSON.stringify(exportData, null, 2)
  }

  private static generatePDFExport(result: ProcessingResult, includeMetadata: boolean): string {
    // In a real implementation, you would use a PDF generation library
    // For now, return the text content with PDF-like formatting
    return this.generateTextExport(result, includeMetadata)
  }

  private static generateDocxExport(result: ProcessingResult, includeMetadata: boolean): string {
    // In a real implementation, you would use a DOCX generation library
    // For now, return the text content
    return this.generateTextExport(result, includeMetadata)
  }

  private static generateRiskAnalysis(result: ProcessingResult) {
    const riskLevels = {
      CRITICAL: result.detections.filter((d) => d.riskLevel === "CRITICAL").length,
      HIGH: result.detections.filter((d) => d.riskLevel === "HIGH").length,
      MEDIUM: result.detections.filter((d) => d.riskLevel === "MEDIUM").length,
      LOW: result.detections.filter((d) => d.riskLevel === "LOW").length,
    }

    const typeDistribution = result.detections.reduce(
      (acc, detection) => {
        acc[detection.type] = (acc[detection.type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      riskLevels,
      typeDistribution,
      overallRiskScore: this.calculateOverallRisk(riskLevels),
      recommendations: this.generateRecommendations(riskLevels),
    }
  }

  private static calculateOverallRisk(riskLevels: Record<string, number>): number {
    const weights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
    const totalWeight = Object.entries(riskLevels).reduce((sum, [level, count]) => {
      return sum + count * weights[level as keyof typeof weights]
    }, 0)
    const totalItems = Object.values(riskLevels).reduce((sum, count) => sum + count, 0)
    return totalItems > 0 ? (totalWeight / totalItems / 4) * 100 : 0
  }

  private static generateRecommendations(riskLevels: Record<string, number>): string[] {
    const recommendations: string[] = []

    if (riskLevels.CRITICAL > 0) {
      recommendations.push("Immediate action required: Critical PII detected (SSN, Credit Cards, Medical Records)")
    }
    if (riskLevels.HIGH > 0) {
      recommendations.push("High priority: Review and secure high-risk PII (Names, Addresses, Phone Numbers)")
    }
    if (riskLevels.MEDIUM > 0) {
      recommendations.push("Medium priority: Consider additional protection for medium-risk data")
    }
    if (riskLevels.LOW > 0) {
      recommendations.push("Low priority: Monitor low-risk PII for compliance requirements")
    }

    return recommendations
  }

  private static downloadFile(content: string, fileName: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const element = document.createElement("a")
    element.href = url
    element.download = fileName
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    URL.revokeObjectURL(url)
  }
}
