export interface ProcessingResult {
  id: string
  originalText: string
  redactedText: string
  detections: any[]
  processingTime: number
  confidence: number
  fileName: string
  fileType: string
  fileSize: number
  status: "processing" | "completed" | "error"
  progress: number
  error?: string
}

export class FileProcessor {
  private static instance: FileProcessor
  private processingQueue: Array<{
    file: File
    resolve: (result: ProcessingResult) => void
    reject: (error: Error) => void
  }> = []
  private isProcessing = false

  static getInstance(): FileProcessor {
    if (!FileProcessor.instance) {
      FileProcessor.instance = new FileProcessor()
    }
    return FileProcessor.instance
  }

  async processFile(file: File, onProgress?: (progress: number) => void): Promise<ProcessingResult> {
    return new Promise((resolve, reject) => {
      this.processingQueue.push({ file, resolve, reject })
      this.processQueue(onProgress)
    })
  }

  private async processQueue(onProgress?: (progress: number) => void): Promise<void> {
    if (this.isProcessing || this.processingQueue.length === 0) return

    this.isProcessing = true
    const { file, resolve, reject } = this.processingQueue.shift()!

    try {
      const result = await this.processFileInternal(file, onProgress)
      resolve(result)
    } catch (error) {
      reject(error as Error)
    } finally {
      this.isProcessing = false
      if (this.processingQueue.length > 0) {
        this.processQueue(onProgress)
      }
    }
  }

  private async processFileInternal(file: File, onProgress?: (progress: number) => void): Promise<ProcessingResult> {
    const startTime = Date.now()
    const resultId = `result_${Date.now()}_${Math.random()}`

    const result: ProcessingResult = {
      id: resultId,
      originalText: "",
      redactedText: "",
      detections: [],
      processingTime: 0,
      confidence: 0,
      fileName: file.name,
      fileType: this.getFileType(file),
      fileSize: file.size,
      status: "processing",
      progress: 0,
    }

    try {
      // Step 1: Read file content
      onProgress?.(20)
      await this.delay(300)

      const fileContent = await this.readFileContent(file)
      result.originalText = fileContent

      // Step 2: Extract text if needed
      onProgress?.(40)
      await this.delay(500)

      let textContent = fileContent
      if (file.type.startsWith("image/")) {
        textContent = await this.extractTextFromImage(fileContent)
      } else if (file.type === "application/pdf") {
        textContent = await this.extractTextFromPDF(fileContent)
      }

      result.originalText = textContent

      // Step 3: Detect PII
      onProgress?.(70)
      await this.delay(800)

      const { PIIDetector } = await import("./pii-detector")
      const detector = new PIIDetector()
      const detections = detector.detect(textContent)
      result.detections = detections

      // Step 4: Generate redacted version
      onProgress?.(90)
      await this.delay(400)

      const redactedText = detector.applyRedactions(textContent, detections)
      result.redactedText = redactedText

      // Step 5: Complete
      onProgress?.(100)
      await this.delay(200)

      result.processingTime = (Date.now() - startTime) / 1000
      result.confidence =
        detections.length > 0 ? detections.reduce((sum, d) => sum + d.confidence, 0) / detections.length : 0.95
      result.status = "completed"
      result.progress = 100

      return result
    } catch (error) {
      result.status = "error"
      result.error = error instanceof Error ? error.message : "Unknown error occurred"
      throw error
    }
  }

  private async readFileContent(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target && e.target.result) {
          resolve(e.target.result as string)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = reject

      if (file.type.startsWith("image/")) {
        reader.readAsDataURL(file)
      } else {
        reader.readAsText(file)
      }
    })
  }

  private async extractTextFromImage(imageDataUrl: string): Promise<string> {
    // Simulate OCR processing
    await this.delay(2000)
    return `EXTRACTED TEXT FROM IMAGE (OCR):

CONFIDENTIAL MEDICAL RECORD
=============================

Patient Information:
Name: Dr. Sarah Johnson
DOB: 03/22/1985
SSN: 123-45-6789
Phone: (555) 123-4567
Email: sarah.johnson@hospital.com
Address: 123 Medical Drive, Boston, MA 02101

Insurance Information:
Provider: Aetna Health Insurance
Policy Number: POL-2024-5432
Member ID: 456789123
Group Number: GRP-789456

Medical Professional Details:
Medical License: MD-MA-987654
DEA Number: BJ1234567
NPI Number: 9876543210

Financial Information:
Credit Card: 4532-1234-5678-9012
Bank Account: ACC-456789123
Routing Number: 071000013
Tax ID: 12-3456789

Emergency Contact:
Name: John Johnson
Phone: (555) 987-6543
Relationship: Spouse
Address: Same as patient

Additional Information:
Passport Number: 123456789
Driver License: S123-4567-8901
Vehicle License Plate: ABC-1234
IP Address: 192.168.1.100
MAC Address: 00:1B:44:11:3A:B7
Device ID: DEV-2024-001

International Banking:
IBAN: US12 3456 7890 1234 5678 90
Swift Code: CHASUS33
Foreign Account: 9876543210123456`
  }

  private async extractTextFromPDF(pdfContent: string): Promise<string> {
    // Simulate PDF text extraction
    await this.delay(1500)
    return pdfContent // In a real implementation, you'd use a PDF parsing library
  }

  private getFileType(file: File): string {
    if (file.type.startsWith("image/")) return "image"
    if (file.type === "application/pdf") return "pdf"
    if (file.type.includes("spreadsheet") || file.type.includes("excel")) return "spreadsheet"
    if (file.type.includes("document") || file.type.includes("word")) return "document"
    return "text"
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  async processBatch(
    files: File[],
    onProgress?: (fileIndex: number, progress: number) => void,
  ): Promise<ProcessingResult[]> {
    const results: ProcessingResult[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        const result = await this.processFile(file, (progress) => {
          onProgress?.(i, progress)
        })
        results.push(result)
      } catch (error) {
        const errorResult: ProcessingResult = {
          id: `error_${Date.now()}_${i}`,
          originalText: "",
          redactedText: "",
          detections: [],
          processingTime: 0,
          confidence: 0,
          fileName: file.name,
          fileType: this.getFileType(file),
          fileSize: file.size,
          status: "error",
          progress: 0,
          error: error instanceof Error ? error.message : "Unknown error",
        }
        results.push(errorResult)
      }
    }

    return results
  }
}
