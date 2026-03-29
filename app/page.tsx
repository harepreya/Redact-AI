"use client"

import {
  Upload,
  Shield,
  Zap,
  Globe,
  FileText,
  Eye,
  Download,
  Lock,
  Database,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Clock,
  Sparkles,
  Brain,
  Layers,
  Target,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    { icon: Lock, text: "Military-grade encryption", color: "text-emerald-600" },
    { icon: Database, text: "Zero data retention", color: "text-blue-600" },
    { icon: Shield, text: "GDPR & HIPAA compliant", color: "text-purple-600" },
    { icon: Brain, text: "Advanced AI models", color: "text-orange-600" },
  ]

  const stats = [
    { value: "99.8%", label: "Accuracy rate", icon: CheckCircle },
    { value: "<1s", label: "Processing time", icon: Clock },
    { value: "50+", label: "PII types detected", icon: Eye },
    { value: "Free", label: "Always free", icon: Star },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-8 w-8 text-emerald-600" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  RedactAI
                </span>
                <div className="text-xs bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-medium">
                  Advanced & Free
                </div>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/redact" className="text-slate-600 hover:text-slate-900 transition-colors font-medium">
                Try Demo
              </Link>
              <Link href="/redact">
                <Button className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 shadow-lg">
                  Start Redacting
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50/50 via-blue-50/30 to-purple-50/50" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-500" />

        <div className="container mx-auto text-center max-w-5xl relative z-10">
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 text-emerald-800 rounded-full text-sm font-medium mb-8 border border-emerald-200/50">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Document Redaction • Free Demo
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-tight">
              Simple AI-powered
              <span className="block bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
                document redaction
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto">
              Automatically detect and redact sensitive information from your documents.
              <span className="text-emerald-600 font-semibold"> Free demo, no registration required.</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/redact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Start Redacting
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/redact">
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-4 text-lg border-2 hover:bg-slate-50 transition-all duration-300 bg-transparent"
                >
                  <Eye className="h-5 w-5 mr-2" />
                  Try Live Demo
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    className={`text-center transition-all duration-500 ${
                      currentFeature === index ? "scale-110 opacity-100" : "scale-100 opacity-70"
                    }`}
                  >
                    <div
                      className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white shadow-lg mb-4 ${feature.color} hover:shadow-xl transition-shadow`}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="text-sm font-semibold text-slate-700">{feature.text}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white border-y border-slate-200">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>



      {/* Quick Start Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Try Document Redaction
            <span className="text-emerald-600"> Now</span>
          </h2>
          <p className="text-xl text-slate-600 mb-8">
            No registration required. Start redacting your documents instantly.
          </p>

          <Card className="max-w-2xl mx-auto border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-blue-50/30 hover:border-emerald-300 transition-all duration-300 hover:shadow-xl">
            <CardContent className="p-12">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-blue-100 mb-6">
                  <Upload className="h-10 w-10 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Upload your document</h3>
                <p className="text-slate-600 mb-6">
                  Supports PDF, DOCX, TXT, and images. Quick and easy redaction.
                </p>
                <Link href="/redact">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-8 py-3 shadow-lg hover:shadow-xl transition-all"
                  >
                    Start Redacting
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex items-center justify-center space-x-6 text-sm text-slate-500">
            <div className="flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Secure
            </div>
            <div className="flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Private
            </div>
            <div className="flex items-center">
              <Shield className="h-4 w-4 mr-2" />
              Free
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Simple AI-powered redaction in three easy steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Upload,
                title: "1. Upload Document",
                description: "Upload your document in PDF, DOCX, TXT, or image format",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: Shield,
                title: "2. AI Detection",
                description: "Our AI automatically detects sensitive information like names, emails, SSNs, and more",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Download,
                title: "3. Download Result",
                description: "Review and download your redacted document instantly",
                color: "from-purple-500 to-purple-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50"
              >
                <CardHeader className="pb-4 text-center">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg mx-auto`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-slate-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-slate-50 to-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              AI-powered detection and redaction with comprehensive privacy protection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Smart PII Detection",
                description:
                  "Automatically detect names, emails, SSNs, phone numbers, addresses, credit cards, and 40+ more sensitive data types",
                color: "from-emerald-500 to-emerald-600",
              },
              {
                icon: FileText,
                title: "Multiple Formats",
                description:
                  "Support for PDF, DOCX, TXT, images, and more. Process documents with intelligent text extraction and OCR",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: Zap,
                title: "Fast Processing",
                description:
                  "Lightning-fast AI processing with real-time results. Process documents in seconds, not minutes",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: Eye,
                title: "Live Preview",
                description:
                  "See original and redacted versions side-by-side. Toggle individual detections on or off as needed",
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: Globe,
                title: "Privacy First",
                description:
                  "Your documents are processed securely with zero data retention. Everything happens in your browser",
                color: "from-teal-500 to-teal-600",
              },
              {
                icon: Download,
                title: "Easy Export",
                description:
                  "Download redacted documents in multiple formats including TXT, JSON, PDF, and DOCX with one click",
                color: "from-rose-500 to-rose-600",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-slate-50 hover:from-slate-50 hover:to-white"
              >
                <CardHeader className="pb-4">
                  <div
                    className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Use Cases */}
      <section id="use-cases" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Perfect For Multiple Industries</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Trusted solution for protecting sensitive information across various sectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Healthcare & Medical",
                description:
                  "Protect patient privacy by redacting medical records, patient names, medical IDs, and health information",
                tags: ["Patient Names", "Medical IDs", "SSNs", "Addresses", "Phone Numbers", "Health Records"],
                gradient: "from-emerald-500 to-teal-500",
                icon: "🏥",
              },
              {
                title: "Financial Services",
                description:
                  "Secure financial documents by removing account numbers, credit cards, transaction details, and personal data",
                tags: ["Account Numbers", "Credit Cards", "SSNs", "Transaction IDs", "Routing Numbers", "Tax IDs"],
                gradient: "from-blue-500 to-indigo-500",
                icon: "🏦",
              },
              {
                title: "Legal & Compliance",
                description:
                  "Redact legal documents while maintaining document integrity for court submissions and client confidentiality",
                tags: ["Client Names", "Case Numbers", "Addresses", "Phone Numbers", "Bar Numbers", "Court IDs"],
                gradient: "from-purple-500 to-pink-500",
                icon: "⚖️",
              },
              {
                title: "Research & Academia",
                description:
                  "Anonymize research data and survey responses while preserving data integrity for academic studies",
                tags: ["Participant IDs", "Demographics", "Contact Info", "Email Addresses", "Survey Data"],
                gradient: "from-orange-500 to-red-500",
                icon: "🔬",
              },
            ].map((useCase, index) => (
              <Card key={index} className="group hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${useCase.gradient}`} />
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">{useCase.icon}</div>
                    <CardTitle className="text-2xl text-slate-900">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription className="text-slate-600 text-base leading-relaxed">
                    {useCase.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {useCase.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-600 to-blue-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Redact Your Documents?</h2>
          <p className="text-lg text-white/90 mb-8">Try our free demo now. No registration required.</p>

          <Link href="/redact">
            <Button
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              <Upload className="h-5 w-5 mr-2" />
              Start Redacting Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-emerald-400" />
              <span className="text-lg font-bold text-white">RedactAI</span>
              <span className="text-sm text-slate-400">Simple Document Redaction Demo</span>
            </div>
            <div className="flex items-center space-x-4 text-sm text-slate-400">
              <div className="flex items-center">
                <Lock className="h-4 w-4 mr-1" />
                Secure
              </div>
              <div className="flex items-center">
                <Database className="h-4 w-4 mr-1" />
                Private
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Free
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-slate-500 mt-4">
            © 2025 RedactAI Demo. For demonstration purposes only.
          </div>
        </div>
      </footer>
    </div>
  )
}
