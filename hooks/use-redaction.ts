"use client"

import { useState, useCallback } from "react"
import { FileProcessor, type ProcessingResult } from "@/lib/file-processor"
import { ExportManager, type ExportOptions } from "@/lib/export-manager"
import type { PIIDetection } from "@/lib/pii-detector"
import { toast } from "sonner"

export interface RedactionSettings {
  sensitivity: "low" | "medium" | "high" | "custom"
  preserveContext: boolean
  customMasking: boolean
  batchMode: boolean
  confidenceThreshold: number
  enabledTypes: string[]
  customPatterns: Array<{ id: string; name: string; pattern: string; enabled: boolean }>
  maskingStyle: "blocks" | "asterisks" | "custom" | "preserve"
  exportFormat: "txt" | "pdf" | "docx" | "json"
}

export function useRedaction() {
  const [files, setFiles] = useState<File[]>([])
  const [results, setResults] = useState<ProcessingResult[]>([])
  const [processing, setProcessing] = useState(false)
  const [selectedResult, setSelectedResult] = useState<number>(0)
  const [settings, setSettings] = useState<RedactionSettings>({
    sensitivity: "high",
    preserveContext: true,
    customMasking: true,
    batchMode: true,
    confidenceThreshold: 0.75,
    enabledTypes: [],
    customPatterns: [],
    maskingStyle: "blocks",
    exportFormat: "txt",
  })

  const addFiles = useCallback((newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles])
  }, [])

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const processDocuments = useCallback(async () => {
    if (files.length === 0) return

    setProcessing(true)
    setResults([])

    try {
      const processor = FileProcessor.getInstance()
      const newResults: ProcessingResult[] = []

      if (settings.batchMode && files.length > 1) {
        // Batch processing
        const batchResults = await processor.processBatch(files, (fileIndex, progress) => {
          // Update progress for specific file
          const updatedResults = [...newResults]
          if (updatedResults[fileIndex]) {
            updatedResults[fileIndex].progress = progress
            setResults([...updatedResults])
          }
        })
        setResults(batchResults)
      } else {
        // Sequential processing
        for (let i = 0; i < files.length; i++) {
          const file = files[i]
          try {
            const result = await processor.processFile(file, (progress) => {
              setResults((prev) => {
                const updated = [...prev]
                if (updated[i]) {
                  updated[i].progress = progress
                } else {
                  updated[i] = {
                    id: `temp_${i}`,
                    originalText: "",
                    redactedText: "",
                    detections: [],
                    processingTime: 0,
                    confidence: 0,
                    fileName: file.name,
                    fileType: file.type.startsWith("image/") ? "image" : "text",
                    fileSize: file.size,
                    status: "processing",
                    progress,
                  }
                }
                return updated
              })
            })
            newResults.push(result)
            setResults([...newResults])
          } catch (error) {
            const errorResult: ProcessingResult = {
              id: `error_${Date.now()}_${i}`,
              originalText: "",
              redactedText: "",
              detections: [],
              processingTime: 0,
              confidence: 0,
              fileName: file.name,
              fileType: file.type.startsWith("image/") ? "image" : "text",
              fileSize: file.size,
              status: "error",
              progress: 0,
              error: error instanceof Error ? error.message : "Unknown error",
            }
            newResults.push(errorResult)
            setResults([...newResults])
          }
        }
      }
    } catch (error) {
      console.error("Error processing documents:", error)
    } finally {
      setProcessing(false)
    }
  }, [files, settings])

  const toggleDetection = useCallback((resultIndex: number, detectionId: string) => {
    setResults((prev) => {
      const newResults = [...prev]
      const result = newResults[resultIndex]
      if (result) {
        const detection = result.detections.find((d: PIIDetection) => d.id === detectionId)
        if (detection) {
          detection.enabled = !detection.enabled
          // Regenerate redacted text
          const { PIIDetector } = require("@/lib/pii-detector")
          const detector = new PIIDetector()
          result.redactedText = detector.applyRedactions(result.originalText, result.detections)
        }
      }
      return newResults
    })
  }, [])

  const updateCustomRedaction = useCallback((resultIndex: number, detectionId: string, customRedaction: string) => {
    setResults((prev) => {
      const newResults = [...prev]
      const result = newResults[resultIndex]
      if (result) {
        const detection = result.detections.find((d: PIIDetection) => d.id === detectionId)
        if (detection) {
          detection.customRedaction = customRedaction
          // Regenerate redacted text
          const { PIIDetector } = require("@/lib/pii-detector")
          const detector = new PIIDetector()
          result.redactedText = detector.applyRedactions(result.originalText, result.detections)
        }
      }
      return newResults
    })
  }, [])

  const exportResult = useCallback(
    async (resultIndex: number, options?: Partial<ExportOptions>) => {
      const result = results[resultIndex]
      if (!result) return

      const exportOptions: ExportOptions = {
        format: settings.exportFormat,
        includeMetadata: true,
        includeAuditTrail: true,
        ...options,
      }

      await ExportManager.exportResult(result, exportOptions)
    },
    [results, settings.exportFormat],
  )

  const exportBatch = useCallback(
    async (options?: Partial<ExportOptions>) => {
      if (results.length === 0) return

      const exportOptions: ExportOptions = {
        format: "json",
        includeMetadata: true,
        includeAuditTrail: true,
        ...options,
      }

      await ExportManager.exportBatch(results, exportOptions)
    },
    [results],
  )

  const loadSampleData = useCallback((sampleType: string = "comprehensive") => {
    let sampleContent = ""
    let fileName = ""

    switch (sampleType) {
      case "comprehensive":
        fileName = "comprehensive-medical-record.txt"
        sampleContent = `CONFIDENTIAL MEDICAL RECORD - COMPREHENSIVE SAMPLE
====================================================

PATIENT INFORMATION
-------------------
Full Name: Dr. Emily Rodriguez
Date of Birth: 08/15/1978
Social Security Number: 456-78-9012
Primary Phone: (555) 234-5678
Secondary Phone: 555-234-5679
Email Address: emily.rodriguez@healthclinic.com
Home Address: 456 Oak Avenue, Springfield, IL 62701

INSURANCE DETAILS
-----------------
Insurance Provider: Blue Cross Blue Shield
Policy Number: POL-2024-8765
Member ID: 987654321
Group Number: GRP-456789
Effective Date: 01/01/2024

MEDICAL PROFESSIONAL INFORMATION
---------------------------------
Medical License: MD-IL-123456
DEA Number: BR1234567
NPI Number: 1234567890
Board Certification: Internal Medicine

FINANCIAL INFORMATION
---------------------
Primary Credit Card: 5555-4444-3333-2222
Secondary Credit Card: 4532-1234-5678-9012
Bank Account Number: ACC-789012345
Routing Number: 071000013
Tax Identification: 12-3456789

EMERGENCY CONTACTS
------------------
Primary Contact: Michael Rodriguez
Relationship: Spouse
Phone: (555) 876-5432
Email: michael.rodriguez@email.com
Address: 456 Oak Avenue, Springfield, IL 62701

Secondary Contact: Sarah Johnson
Relationship: Sister
Phone: (555) 123-9876
Email: sarah.j@email.com

IDENTIFICATION DOCUMENTS
------------------------
Passport Number: 123456789
Driver's License: R123-4567-8901
State ID: IL-2024-456789
Vehicle License Plate: ABC-1234

TECHNICAL INFORMATION
---------------------
IP Address: 172.16.0.1
MAC Address: 00:1B:44:11:3A:B7
Device ID: DEV-2024-001
System URL: https://patient-portal.healthclinic.com/profile

INTERNATIONAL BANKING
---------------------
IBAN: US12 3456 7890 1234 5678 90
Swift Code: CHASUS33
Foreign Account: 9876543210123456

LEGAL INFORMATION
-----------------
Case Number: CASE-2024-001
Bar Number: BAR-MA-12345
Attorney: Jane Smith, Esq.
Court ID: COURT-2024-789

ADDITIONAL IDENTIFIERS
----------------------
Medical Record Number: MRN-2024-456789
Patient ID: PAT-987654
Chart Number: CHART-456789
Security Code: SEC-789456
Fingerprint ID: FP-ABC123DEF456

NOTES
-----
This is a comprehensive sample document containing 50+ types of PII for testing
the AI redaction system. All information is fictional and for demonstration purposes only.

Last Updated: ${new Date().toLocaleDateString()}
Document ID: DOC-${Date.now()}`
        break

      case "financial":
        fileName = "financial-statement.txt"
        sampleContent = `CONFIDENTIAL FINANCIAL STATEMENT
=================================

CLIENT INFORMATION
------------------
Name: John Michael Anderson
SSN: 123-45-6789
Date of Birth: 03/22/1985
Phone: (555) 987-6543
Email: john.anderson@email.com
Address: 789 Financial Plaza, New York, NY 10001

ACCOUNT DETAILS
---------------
Primary Account: ACC-2024-567890
Routing Number: 021000021
Account Type: Checking
Balance: $125,450.32

CREDIT CARDS
------------
Visa Card: 4532-8765-4321-0987
Expiration: 12/2027
CVV: 456

Mastercard: 5555-6666-7777-8888
Expiration: 08/2026
CVV: 789

American Express: 3782-822463-10005
Expiration: 05/2028

INVESTMENT ACCOUNTS
-------------------
Brokerage Account: BRK-456789123
Tax ID: 98-7654321
Investment Advisor: Sarah Williams
Advisor Phone: (555) 234-8901
Advisor Email: s.williams@investments.com

LOAN INFORMATION
----------------
Mortgage Account: MTG-2024-789456
Property Address: 789 Financial Plaza, New York, NY 10001
Loan Amount: $450,000
Monthly Payment: $2,850

Auto Loan: AUTO-2024-123456
Vehicle VIN: 1HGBH41JXMN109186
License Plate: NYS-4567

INTERNATIONAL BANKING
---------------------
IBAN: US33 XXX 1234567890123456
Swift Code: CHASUS33XXX
Foreign Account: 9876543210987654

CONTACT INFORMATION
-------------------
Financial Advisor: Robert Chen
Phone: (555) 345-6789
Email: r.chen@financialgroup.com
Office: 123 Wall Street, Suite 4500, New York, NY 10005

Last Updated: ${new Date().toLocaleDateString()}
Statement ID: STMT-${Date.now()}`
        break

      case "legal":
        fileName = "legal-case-document.txt"
        sampleContent = `CONFIDENTIAL LEGAL DOCUMENT
===========================

CASE INFORMATION
----------------
Case Number: CASE-2024-CV-12345
Court: Superior Court of California
Judge: Hon. Patricia Martinez
Filing Date: 01/15/2024

PLAINTIFF INFORMATION
---------------------
Name: Jennifer Marie Thompson
SSN: 234-56-7890
Date of Birth: 06/10/1980
Address: 456 Legal Avenue, Los Angeles, CA 90001
Phone: (555) 456-7890
Email: j.thompson@email.com
Driver's License: CA-D1234567

DEFENDANT INFORMATION
---------------------
Name: David Robert Wilson
SSN: 345-67-8901
Date of Birth: 11/25/1975
Address: 789 Defense Street, Los Angeles, CA 90002
Phone: (555) 567-8901
Email: d.wilson@email.com
Driver's License: CA-D7654321

LEGAL REPRESENTATION
--------------------
Plaintiff Attorney: Michael Stevens, Esq.
Bar Number: BAR-CA-123456
Law Firm: Stevens & Associates
Phone: (555) 234-5678
Email: m.stevens@stevenslaw.com
Address: 100 Law Plaza, Los Angeles, CA 90012

Defendant Attorney: Lisa Chen, Esq.
Bar Number: BAR-CA-654321
Law Firm: Chen Legal Group
Phone: (555) 345-6789
Email: l.chen@chenlegal.com
Address: 200 Defense Tower, Los Angeles, CA 90013

FINANCIAL DETAILS
-----------------
Disputed Amount: $75,000
Plaintiff Bank Account: ACC-789456123
Defendant Credit Card: 4532-9876-5432-1098

EVIDENCE REFERENCES
-------------------
Document ID: DOC-2024-001
Email Evidence: evidence@legalhold.com
IP Address: 192.168.1.100
Device ID: DEV-LEGAL-2024

WITNESS INFORMATION
-------------------
Witness 1: Robert Martinez
Phone: (555) 678-9012
Email: r.martinez@email.com
Address: 321 Witness Lane, Los Angeles, CA 90003

Witness 2: Susan Taylor
Phone: (555) 789-0123
Email: s.taylor@email.com
SSN: 456-78-9012

COURT DATES
-----------
Next Hearing: 03/15/2024
Case Manager: Angela Rodriguez
Phone: (555) 890-1234
Court ID: COURT-LA-2024-789

Last Updated: ${new Date().toLocaleDateString()}
Document ID: LEGAL-${Date.now()}`
        break

      case "hr":
        fileName = "employee-record.txt"
        sampleContent = `CONFIDENTIAL EMPLOYEE RECORD
============================

EMPLOYEE INFORMATION
--------------------
Full Name: Maria Elena Garcia
Employee ID: EMP-2024-5678
SSN: 567-89-0123
Date of Birth: 09/18/1990
Date of Hire: 01/10/2020

CONTACT INFORMATION
-------------------
Personal Email: maria.garcia@email.com
Work Email: m.garcia@company.com
Phone: (555) 678-9012
Mobile: (555) 789-0123
Address: 567 Employee Drive, Chicago, IL 60601

EMERGENCY CONTACT
-----------------
Name: Carlos Garcia
Relationship: Spouse
Phone: (555) 890-1234
Email: carlos.garcia@email.com
Address: 567 Employee Drive, Chicago, IL 60601

PAYROLL INFORMATION
-------------------
Bank Name: First National Bank
Account Number: ACC-567890123
Routing Number: 071000013
Direct Deposit: Active
Annual Salary: $85,000

TAX INFORMATION
---------------
Tax ID: 12-3456789
W-4 Status: Married Filing Jointly
Dependents: 2
State Tax ID: IL-TAX-567890

BENEFITS
--------
Health Insurance: Policy-2024-7890
Member ID: MEM-567890123
Group Number: GRP-789012
Dental Insurance: DEN-2024-456
Vision Insurance: VIS-2024-789

401(K) INFORMATION
------------------
Account Number: 401K-567890
Contribution: 6%
Employer Match: 3%
Vesting Date: 01/10/2024

IDENTIFICATION
--------------
Driver's License: IL-D5678901
Passport Number: 567890123
State ID: IL-2024-567890

PERFORMANCE REVIEWS
-------------------
Manager: Robert Johnson
Manager Email: r.johnson@company.com
Manager Phone: (555) 901-2345
Last Review Date: 12/15/2023
Next Review: 12/15/2024

TECHNICAL ACCESS
----------------
Computer ID: COMP-5678
IP Address: 10.0.0.45
VPN Access: Active
Badge Number: BADGE-567890

Last Updated: ${new Date().toLocaleDateString()}
Record ID: HR-${Date.now()}`
        break

      default:
        fileName = "comprehensive-medical-record.txt"
        sampleContent = "Sample data not found."
    }

    const sampleFile = new File([sampleContent], fileName, { type: "text/plain" })
    setFiles([sampleFile])
    toast.success(`Sample data loaded: ${fileName}`)
  }, [])

  const resetAll = useCallback(() => {
    setFiles([])
    setResults([])
    setSelectedResult(0)
    setProcessing(false)
  }, [])

  return {
    // State
    files,
    results,
    processing,
    selectedResult,
    settings,

    // Actions
    addFiles,
    removeFile,
    processDocuments,
    toggleDetection,
    updateCustomRedaction,
    exportResult,
    exportBatch,
    loadSampleData,
    resetAll,
    setSelectedResult,
    setSettings,
  }
}
