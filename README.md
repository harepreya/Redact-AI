# 🛡️ RedactAI - AI-Powered Document Redaction

RedactAI is a free, client-side web application that automatically detects and redacts sensitive personally identifiable information (PII) from documents. Built with Next.js and TypeScript, it uses advanced pattern recognition to identify 50+ types of PII including names, addresses, financial data, medical records, and more. All processing happens in the browser with zero data retention, ensuring maximum privacy and security.

## ✨ Features

### 🏠 Homepage
- Clean, professional landing page
- Simple navigation
- Feature showcase
- Industry use cases
- Minimal footer

### 🔒 Redaction Tool (`/redact`)
- **Upload Documents** - Drag & drop or browse files
- **4 Sample Datasets** - Pre-configured test data
- **AI Processing** - Automatic PII detection (50+ types)
- **Live Preview** - Side-by-side comparison
- **Interactive Editing** - Toggle/customize redactions
- **Multiple Export Formats** - TXT, JSON, PDF, DOCX
- **Batch Processing** - Handle multiple files
- **Risk Analysis** - Detailed PII breakdown

## 📊 Sample Datasets

Choose from 4 different sample documents:

| Sample | Icon | PII Types | Best For |
|--------|------|-----------|----------|
| Medical Record | 🏥 | 50+ | Comprehensive testing |
| Financial Statement | 🏦 | 20+ | Banking/Finance |
| Legal Case Document | ⚖️ | 25+ | Legal documents |
| Employee Record | 👤 | 30+ | HR/Payroll |

## 🎯 PII Detection (50+ Types)

### Personal Information
- Names, Emails, Phone Numbers
- Social Security Numbers (SSN)
- Date of Birth, Addresses

### Financial Information
- Credit Card Numbers
- Bank Account Numbers
- Routing Numbers, Tax IDs
- IBAN, Swift Codes

### Medical Information
- Medical Record Numbers
- Medical License Numbers
- DEA Numbers, NPI Numbers

### Government IDs
- Driver's License Numbers
- Passport Numbers
- State IDs, License Plates

### Technical Information
- IP Addresses, MAC Addresses
- URLs, Device IDs

### Legal Information
- Case Numbers, Bar Numbers
- Court IDs

### And 30+ more types!

## 🎨 Tech Stack

- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn UI + Radix UI
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)
  
### Masking Styles
- **Blocks:** `█████`
- **Asterisks:** `*****`
- **Smart:** Preserves format (e.g., `j***@email.com`)
- **Custom:** `[TYPE]`

## 📁 Project Structure

```
ai-redaction-project/
├── app/
│   ├── page.tsx              # Homepage
│   ├── redact/
│   │   └── page.tsx          # Redaction tool
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # Shadcn UI components
├── hooks/
│   └── use-redaction.ts      # Main redaction hook
├── lib/
│   ├── pii-detector.ts       # PII detection engine
│   ├── file-processor.ts     # File processing
│   └── export-manager.ts     # Export functionality
└── public/                   # Static assets
```
### 1. Upload Document
- Click "Choose Files" or drag & drop
- Supports: PDF, DOCX, TXT, Images

### 2. Or Load Sample
- Click "Load Sample Data"
- Choose from 4 sample types
- Instant loading

### 3. Process
- Click "Start Processing"
- Watch real-time progress
- AI detects all PII

### 4. Review & Edit
- See original vs redacted
- Toggle individual detections
- Add custom redactions
- View risk analysis

### 5. Export
- Choose format (TXT/JSON/PDF/DOCX)
- Download single file
- Or export batch results

## 🔒 Privacy & Security

- ✅ **Client-side Processing** - No server uploads
- ✅ **Zero Data Retention** - Nothing stored
- ✅ **No Registration** - Start immediately
- ✅ **Free Forever** - No limits


