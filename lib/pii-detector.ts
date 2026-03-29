export interface PIIDetection {
  id: string
  type: string
  text: string
  confidence: number
  start: number
  end: number
  redacted: string
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  contextBefore?: string
  contextAfter?: string
  enabled: boolean
  customRedaction?: string
}

export interface DetectionPattern {
  type: string
  regex: RegExp
  confidence: number
  validator?: (match: string) => boolean
}

export class PIIDetector {
  private patterns: DetectionPattern[] = [
    // Personal Information
    {
      type: "EMAIL",
      regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      confidence: 0.95,
      validator: (match) => match.includes("@") && match.includes("."),
    },
    {
      type: "PHONE",
      regex:
        /(\(\d{3}\)\s?\d{3}[-.\s]?\d{4}|\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\+\d{1,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}[-.\s]?\d{3,4})/g,
      confidence: 0.9,
      validator: (match) => match.replace(/\D/g, "").length >= 10,
    },
    {
      type: "SSN",
      regex: /\b\d{3}-\d{2}-\d{4}\b/g,
      confidence: 0.98,
      validator: (match) => {
        const digits = match.replace(/-/g, "")
        return digits.length === 9 && digits !== "000000000"
      },
    },
    {
      type: "PERSON_NAME",
      regex: /\b(?:Dr\.|Mr\.|Mrs\.|Ms\.|Prof\.)?\s*[A-Z][a-z]{2,}\s+[A-Z][a-z]{2,}(?:\s+[A-Z][a-z]{2,})?\b/g,
      confidence: 0.75,
      validator: (match) => {
        const commonWords = ["New York", "Los Angeles", "United States", "Medical Record", "Patient Information"]
        return !commonWords.some((word) => match.includes(word))
      },
    },

    // Financial Information
    {
      type: "CREDIT_CARD",
      regex: /\b(?:\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}|\d{13,19})\b/g,
      confidence: 0.92,
      validator: (match) => {
        const digits = match.replace(/[-\s]/g, "")
        return digits.length >= 13 && digits.length <= 19 && this.luhnCheck(digits)
      },
    },
    {
      type: "ACCOUNT_NUMBER",
      regex: /\b(?:Account|Acct|ACC)\s*#?\s*[A-Z0-9-]{8,20}\b/gi,
      confidence: 0.86,
    },
    {
      type: "ROUTING_NUMBER",
      regex: /\b(?:Routing|ABA|RTN)\s*#?\s*\d{9}\b/gi,
      confidence: 0.94,
      validator: (match) => {
        const digits = match.replace(/\D/g, "")
        return digits.length === 9
      },
    },

    // Medical Information
    {
      type: "MEDICAL_RECORD",
      regex: /\b(?:MRN|Medical Record|Patient ID|Chart)\s*#?\s*[A-Z0-9-]{6,15}\b/gi,
      confidence: 0.91,
    },
    {
      type: "MEDICAL_LICENSE",
      regex: /\b(?:MD|Medical License)\s*-?\s*[A-Z]{2}\s*-?\s*\d{6}\b/gi,
      confidence: 0.91,
    },
    {
      type: "DEA_NUMBER",
      regex: /\b[A-Z]{2}\d{7}\b/g,
      confidence: 0.93,
    },
    {
      type: "NPI_NUMBER",
      regex: /\b(?:NPI|National Provider)\s*#?\s*\d{10}\b/gi,
      confidence: 0.94,
    },

    // Government IDs
    {
      type: "DRIVERS_LICENSE",
      regex: /\b(?:DL|Driver['\s]?s?\s*License|License)\s*#?\s*[A-Z0-9-]{8,15}\b/gi,
      confidence: 0.87,
    },
    {
      type: "PASSPORT",
      regex: /\b(?:Passport|PP)\s*#?\s*[A-Z0-9]{6,9}\b/gi,
      confidence: 0.89,
    },
    {
      type: "DATE_OF_BIRTH",
      regex:
        /\b(?:DOB|Date of Birth|Born|Birth Date)[\s:]*(\d{1,2}\/\d{1,2}\/\d{4}|\d{4}-\d{2}-\d{2}|\d{2}\/\d{2}\/\d{4})\b/gi,
      confidence: 0.93,
    },

    // Address Information
    {
      type: "ADDRESS",
      regex:
        /\b\d+\s+[A-Za-z0-9\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Boulevard|Blvd|Lane|Ln|Drive|Dr|Court|Ct|Place|Pl|Way)\b[^,]*,?\s*[A-Za-z\s]*,?\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?\b/gi,
      confidence: 0.88,
    },
    {
      type: "ZIP_CODE",
      regex: /\b\d{5}(?:-\d{4})?\b/g,
      confidence: 0.85,
    },

    // Technical Information
    {
      type: "IP_ADDRESS",
      regex: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
      confidence: 0.85,
      validator: (match) => {
        const parts = match.split(".")
        return parts.every((part) => Number.parseInt(part) <= 255)
      },
    },
    {
      type: "MAC_ADDRESS",
      regex: /\b([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})\b/g,
      confidence: 0.9,
    },
    {
      type: "URL",
      regex: /https?:\/\/[^\s]+/g,
      confidence: 0.8,
    },

    // Additional patterns for comprehensive coverage
    {
      type: "INSURANCE_POLICY",
      regex: /\b(?:Policy|POL|Insurance)\s*#?\s*[A-Z0-9-]{8,20}\b/gi,
      confidence: 0.88,
    },
    {
      type: "GROUP_NUMBER",
      regex: /\b(?:Group|GRP)\s*#?\s*[A-Z0-9-]{6,15}\b/gi,
      confidence: 0.85,
    },
    {
      type: "LICENSE_PLATE",
      regex: /\b[A-Z]{2,3}-\d{3,4}|[A-Z]{3}-\d{4}|\d{3}-[A-Z]{3}\b/g,
      confidence: 0.82,
    },
    {
      type: "VIN",
      regex: /\b[A-HJ-NPR-Z0-9]{17}\b/g,
      confidence: 0.9,
    },
    {
      type: "DEVICE_ID",
      regex: /\b(?:Device|DEV)\s*-?\s*\d{4}\s*-?\s*\d{3}\b/gi,
      confidence: 0.85,
    },
    {
      type: "TAX_ID",
      regex: /\b(?:Tax ID|TIN|EIN)\s*#?\s*\d{2}-\d{7}\b/gi,
      confidence: 0.9,
    },
    {
      type: "MEMBER_ID",
      regex: /\b(?:Member|MBR)\s*#?\s*[A-Z0-9]{8,15}\b/gi,
      confidence: 0.84,
    },
    {
      type: "IBAN",
      regex: /\b[A-Z]{2}\d{2}\s?[A-Z0-9]{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?[\d{0,2}]?\b/g,
      confidence: 0.92,
    },
    {
      type: "SWIFT_CODE",
      regex: /\b[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?\b/g,
      confidence: 0.89,
    },
  ]

  private customPatterns: DetectionPattern[] = []

  // Luhn algorithm for credit card validation
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0
    let isEven = false

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = Number.parseInt(cardNumber.charAt(i))

      if (isEven) {
        digit *= 2
        if (digit > 9) {
          digit -= 9
        }
      }

      sum += digit
      isEven = !isEven
    }

    return sum % 10 === 0
  }

  addCustomPattern(pattern: DetectionPattern): void {
    this.customPatterns.push(pattern)
  }

  removeCustomPattern(type: string): void {
    this.customPatterns = this.customPatterns.filter((p) => p.type !== type)
  }

  detect(
    text: string,
    options: {
      confidenceThreshold?: number
      enabledTypes?: string[]
      customPatterns?: Array<{ name: string; pattern: string; enabled: boolean }>
    } = {},
  ): PIIDetection[] {
    const { confidenceThreshold = 0.7, enabledTypes = [], customPatterns = [] } = options
    const detections: PIIDetection[] = []

    // Add custom patterns
    const allPatterns = [...this.patterns]
    customPatterns.forEach((customPattern) => {
      if (customPattern.enabled && customPattern.pattern) {
        try {
          allPatterns.push({
            type: `CUSTOM_${customPattern.name.toUpperCase().replace(/\s+/g, "_")}`,
            regex: new RegExp(customPattern.pattern, "gi"),
            confidence: 0.8,
          })
        } catch (error) {
          console.warn("Invalid custom pattern:", customPattern.pattern)
        }
      }
    })

    allPatterns.forEach((pattern) => {
      // Skip if confidence is below threshold
      if (pattern.confidence < confidenceThreshold) return

      // Skip if type is disabled
      if (enabledTypes.length > 0 && !enabledTypes.includes(pattern.type)) return

      let match
      pattern.regex.lastIndex = 0
      while ((match = pattern.regex.exec(text)) !== null) {
        const originalText = match[0]

        // Apply validator if exists
        if (pattern.validator && !pattern.validator(originalText)) {
          continue
        }

        const redactedText = this.generateRedaction(originalText, pattern.type, "blocks")

        const contextStart = Math.max(0, match.index - 30)
        const contextEnd = Math.min(text.length, match.index + originalText.length + 30)
        const contextBefore = text.substring(contextStart, match.index).trim()
        const contextAfter = text.substring(match.index + originalText.length, contextEnd).trim()

        detections.push({
          id: `${pattern.type}_${match.index}_${Date.now()}_${Math.random()}`,
          type: pattern.type,
          text: originalText,
          confidence: pattern.confidence,
          start: match.index,
          end: match.index + originalText.length,
          redacted: redactedText,
          riskLevel: this.calculateRiskLevel(pattern.type, pattern.confidence),
          contextBefore,
          contextAfter,
          enabled: true,
        })
      }
    })

    return detections.sort((a, b) => a.start - b.start)
  }

  generateRedaction(text: string, type: string, style: string): string {
    switch (style) {
      case "blocks":
        return "█".repeat(text.length)
      case "asterisks":
        return "*".repeat(text.length)
      case "preserve":
        return this.smartRedaction(text, type)
      case "custom":
        return `[${type}]`
      default:
        return "█".repeat(text.length)
    }
  }

  private smartRedaction(text: string, type: string): string {
    switch (type) {
      case "EMAIL":
        const [localPart, domain] = text.split("@")
        if (!localPart || !domain) return "█".repeat(text.length)
        const maskedLocal =
          localPart.length > 2
            ? localPart[0] + "█".repeat(localPart.length - 2) + localPart[localPart.length - 1]
            : "█".repeat(localPart.length)
        return maskedLocal + "@" + domain
      case "PHONE":
        return text.replace(/\d/g, "█")
      case "SSN":
        return "███-██-████"
      case "PERSON_NAME":
        const parts = text.split(/\s+/)
        return parts
          .map((part) => {
            if (part.includes(".")) return part
            return part.length > 2
              ? part[0] + "█".repeat(part.length - 2) + part[part.length - 1]
              : "█".repeat(part.length)
          })
          .join(" ")
      case "CREDIT_CARD":
        const digits = text.replace(/\D/g, "")
        if (digits.length >= 13) {
          return `████-████-████-${digits.slice(-4)}`
        }
        return "█".repeat(text.length)
      default:
        return "█".repeat(text.length)
    }
  }

  private calculateRiskLevel(type: string, confidence: number): "LOW" | "MEDIUM" | "HIGH" | "CRITICAL" {
    const criticalTypes = ["SSN", "CREDIT_CARD", "MEDICAL_RECORD", "PASSPORT", "DEA_NUMBER", "TAX_ID"]
    const highTypes = [
      "PHONE",
      "EMAIL",
      "ADDRESS",
      "DATE_OF_BIRTH",
      "DRIVERS_LICENSE",
      "NPI_NUMBER",
      "MEDICAL_LICENSE",
      "ACCOUNT_NUMBER",
    ]
    const mediumTypes = ["PERSON_NAME", "IP_ADDRESS", "INSURANCE_POLICY", "GROUP_NUMBER", "MEMBER_ID"]

    if (criticalTypes.includes(type) && confidence > 0.8) return "CRITICAL"
    if (criticalTypes.includes(type) || (highTypes.includes(type) && confidence > 0.9)) return "HIGH"
    if (highTypes.includes(type) || (mediumTypes.includes(type) && confidence > 0.8)) return "MEDIUM"
    return "LOW"
  }

  applyRedactions(text: string, detections: PIIDetection[]): string {
    let redactedText = text
    const sortedDetections = [...detections].filter((d) => d.enabled).sort((a, b) => b.start - a.start)

    sortedDetections.forEach((detection) => {
      const beforeText = redactedText.substring(0, detection.start)
      const afterText = redactedText.substring(detection.end)
      redactedText = beforeText + (detection.customRedaction || detection.redacted) + afterText
    })

    return redactedText
  }
}
