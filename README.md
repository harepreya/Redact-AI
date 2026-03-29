# 🛡️ RedactAI - AI-Powered Document Redaction

A professional, free demo application for automatically detecting and redacting sensitive information (PII) from documents using AI.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open browser
http://localhost:3000
```

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

## 🔧 Key Components

### `use-redaction.ts` Hook
Main hook managing:
- File upload/removal
- Document processing
- Detection toggling
- Export functionality
- Sample data loading

### `pii-detector.ts`
AI detection engine with:
- 50+ regex patterns
- Confidence scoring
- Risk level calculation
- Custom pattern support
- Smart redaction styles

### `file-processor.ts`
Handles:
- File reading
- Text extraction
- OCR simulation
- Progress tracking
- Batch processing

### `export-manager.ts`
Manages:
- Multiple export formats
- File naming with timestamps
- Metadata inclusion
- Batch exports
- Audit reports

## 🎯 Usage

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

## 📝 Configuration

### Settings Dialog
- AI sensitivity levels
- Confidence threshold
- Masking styles (blocks/asterisks/smart/custom)
- Custom regex patterns
- Batch mode toggle

### Masking Styles
- **Blocks:** `█████`
- **Asterisks:** `*****`
- **Smart:** Preserves format (e.g., `j***@email.com`)
- **Custom:** `[TYPE]`

## 🎨 UI/UX Features

- Responsive design (mobile-friendly)
- Drag & drop file upload
- Real-time progress bars
- Toast notifications
- Smooth animations
- Color-coded risk levels
- Interactive detection cards
- Side-by-side preview

## 📊 Risk Levels

| Level | Color | Examples |
|-------|-------|----------|
| CRITICAL | Red | SSN, Credit Cards, Medical Records |
| HIGH | Orange | Names, Addresses, Phone Numbers |
| MEDIUM | Yellow | Emails, IPs, Insurance IDs |
| LOW | Green | URLs, Generic IDs |

## 🧪 Testing

### Test Sample Load
```bash
1. Go to /redact
2. Click "Load Sample Data"
3. Select any sample
4. Click "Start Processing"
5. Verify detections appear
```

### Test File Upload
```bash
1. Create a text file with PII
2. Upload to /redact
3. Process and verify detection
4. Test export functionality
```

### Test Batch Processing
```bash
1. Upload multiple files
2. Enable batch mode in settings
3. Process all at once
4. Export batch results
```

## 🐛 Troubleshooting

### Build Issues
```bash
# Clean .next folder
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Rebuild
npm run build
```

### TypeScript Errors
```bash
# Check for errors
npx tsc --noEmit --skipLibCheck
```

## 📚 Documentation Files

- `README.md` - This file (main documentation)
- `SAMPLE_DATASETS_INFO.md` - Detailed sample data information

## 🎯 Use Cases

### Healthcare
- Redact patient records
- Anonymize medical data
- HIPAA compliance

### Finance
- Secure financial statements
- Protect account information
- PCI DSS compliance

### Legal
- Redact case documents
- Protect attorney-client privilege
- Court-ready formatting

### HR
- Anonymize employee records
- Secure payroll data
- Benefits information

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Other Platforms
- Netlify
- AWS Amplify
- Azure Static Web Apps
- Google Cloud Run

## 📄 License

This is a demo project for educational purposes.

## 🤝 Contributing

This is a demo project. Feel free to fork and customize!

## 📞 Support

For issues or questions, please check the documentation files included in the project.

---

## ✅ Status: Production Ready

All features implemented and tested. Ready for demonstration or deployment!

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Status:** ✅ Complete & Working
