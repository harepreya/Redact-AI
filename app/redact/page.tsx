"use client"

import React from "react"
import { useRef, useCallback } from "react"
import {
  Upload,
  FileText,
  Shield,
  Clock,
  CheckCircle,
  Download,
  Play,
  Trash2,
  Copy,
  RefreshCw,
  Settings,
  Zap,
  Brain,
  Target,
  FileImage,
  File,
  FileSpreadsheet,
  Pause,
  Edit3,
  Save,
  Undo,
  Redo,
  Filter,
  BarChart3,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useRedaction } from "@/hooks/use-redaction"
import { toast } from "sonner"

export default function RedactPage() {
  const {
    files,
    results,
    processing,
    selectedResult,
    settings,
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
  } = useRedaction()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)
  const [showSettings, setShowSettings] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setDragActive(false)

      if (e.dataTransfer.files) {
        const droppedFiles = Array.from(e.dataTransfer.files)
        addFiles(droppedFiles)
        toast.success(`Added ${droppedFiles.length} file(s) to queue`)
      }
    },
    [addFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files)
        addFiles(selectedFiles)
        toast.success(`Added ${selectedFiles.length} file(s) to queue`)
      }
    },
    [addFiles],
  )

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <FileImage className="h-5 w-5 text-blue-600" />
    if (file.type.includes("pdf")) return <FileText className="h-5 w-5 text-red-600" />
    if (file.type.includes("spreadsheet") || file.type.includes("excel"))
      return <FileSpreadsheet className="h-5 w-5 text-green-600" />
    return <File className="h-5 w-5 text-slate-600" />
  }

  const handleProcessDocuments = async () => {
    try {
      await processDocuments()
      toast.success("Documents processed successfully!")
    } catch (error) {
      toast.error("Error processing documents. Please try again.")
    }
  }

  const handleExportResult = async (format?: string) => {
    try {
      await exportResult(selectedResult, format ? { format: format as any } : undefined)
      toast.success("File exported successfully!")
    } catch (error) {
      toast.error("Error exporting file. Please try again.")
    }
  }

  const handleExportBatch = async () => {
    try {
      await exportBatch()
      toast.success("Batch export completed!")
    } catch (error) {
      toast.error("Error exporting batch. Please try again.")
    }
  }



  const handleReset = () => {
    resetAll()
    toast.success("All data cleared!")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-emerald-600" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                  RedactAI
                </span>
                <div className="text-xs bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent font-medium">
                  Document Redaction Tool
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Dialog open={showSettings} onOpenChange={setShowSettings}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5" />
                      Redaction Settings
                    </DialogTitle>
                    <DialogDescription>
                      Fine-tune AI detection, customize redaction patterns, and configure processing options
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Detection Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>AI Sensitivity Level</Label>
                            <Select
                              value={settings.sensitivity}
                              onValueChange={(value: any) => setSettings((prev) => ({ ...prev, sensitivity: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low - Conservative detection</SelectItem>
                                <SelectItem value="medium">Medium - Balanced approach</SelectItem>
                                <SelectItem value="high">High - Maximum detection</SelectItem>
                                <SelectItem value="custom">Custom - Manual threshold</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Confidence Threshold: {settings.confidenceThreshold}</Label>
                            <Input
                              type="range"
                              min="0.1"
                              max="1"
                              step="0.05"
                              value={settings.confidenceThreshold}
                              onChange={(e) =>
                                setSettings((prev) => ({
                                  ...prev,
                                  confidenceThreshold: Number.parseFloat(e.target.value),
                                }))
                              }
                              className="mt-2"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Redaction Style</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label>Masking Style</Label>
                            <Select
                              value={settings.maskingStyle}
                              onValueChange={(value: any) => setSettings((prev) => ({ ...prev, maskingStyle: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="blocks">█████ (Blocks)</SelectItem>
                                <SelectItem value="asterisks">***** (Asterisks)</SelectItem>
                                <SelectItem value="preserve">Smart Preserve</SelectItem>
                                <SelectItem value="custom">[TYPE] (Custom)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="preserveContext"
                                checked={settings.preserveContext}
                                onChange={(e) =>
                                  setSettings((prev) => ({ ...prev, preserveContext: e.target.checked }))
                                }
                              />
                              <Label htmlFor="preserveContext">Preserve document context</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="customMasking"
                                checked={settings.customMasking}
                                onChange={(e) => setSettings((prev) => ({ ...prev, customMasking: e.target.checked }))}
                              />
                              <Label htmlFor="customMasking">Smart pattern masking</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="batchMode"
                                checked={settings.batchMode}
                                onChange={(e) => setSettings((prev) => ({ ...prev, batchMode: e.target.checked }))}
                              />
                              <Label htmlFor="batchMode">Enable batch processing</Label>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Custom Patterns</CardTitle>
                        <CardDescription>Add custom regex patterns for specialized PII detection</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              const newPattern = {
                                id: Date.now().toString(),
                                name: `Custom Pattern ${settings.customPatterns.length + 1}`,
                                pattern: "",
                                enabled: true,
                              }
                              setSettings((prev) => ({
                                ...prev,
                                customPatterns: [...prev.customPatterns, newPattern],
                              }))
                            }}
                          >
                            Add Custom Pattern
                          </Button>
                          {settings.customPatterns.map((pattern) => (
                            <div key={pattern.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                              <input
                                type="checkbox"
                                checked={pattern.enabled}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    customPatterns: prev.customPatterns.map((p) =>
                                      p.id === pattern.id ? { ...p, enabled: e.target.checked } : p,
                                    ),
                                  }))
                                }}
                              />
                              <Input
                                placeholder="Pattern name"
                                value={pattern.name}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    customPatterns: prev.customPatterns.map((p) =>
                                      p.id === pattern.id ? { ...p, name: e.target.value } : p,
                                    ),
                                  }))
                                }}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Regex pattern"
                                value={pattern.pattern}
                                onChange={(e) => {
                                  setSettings((prev) => ({
                                    ...prev,
                                    customPatterns: prev.customPatterns.map((p) =>
                                      p.id === pattern.id ? { ...p, pattern: e.target.value } : p,
                                    ),
                                  }))
                                }}
                                className="flex-1 font-mono text-sm"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSettings((prev) => ({
                                    ...prev,
                                    customPatterns: prev.customPatterns.filter((p) => p.id !== pattern.id),
                                  }))
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </DialogContent>
              </Dialog>

              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Upload Section */}
        {results.length === 0 && (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                AI Document Redaction
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Upload your documents and let AI automatically detect and redact sensitive information with batch
                processing and real-time editing capabilities
              </p>
            </div>

            <Card className="border-2 border-dashed border-emerald-200 bg-gradient-to-br from-emerald-50/50 via-blue-50/30 to-purple-50/50 hover:border-emerald-300 transition-all duration-300">
              <CardContent className="p-8">
                <div
                  className={`text-center transition-all duration-300 ${dragActive ? "scale-105" : "scale-100"}`}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 via-blue-100 to-purple-100 mb-6">
                    <Upload className="h-10 w-10 text-emerald-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Drop your documents here</h3>
                  <p className="text-slate-600 mb-6 max-w-md mx-auto">
                    Supports  DOCX, TXT, images, and more. Batch processing up to 50 files. Maximum 100MB total.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 hover:from-emerald-700 hover:via-blue-700 hover:to-purple-700"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-5 w-5 mr-2" />
                      Choose Files
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="lg" variant="outline">
                          <FileText className="h-5 w-5 mr-2" />
                          Load Sample Data
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Choose Sample Dataset</DialogTitle>
                          <DialogDescription>
                            Select a pre-configured sample document to test the redaction features
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                          <Button
                            variant="outline"
                            className="h-auto p-4 text-left justify-start hover:bg-emerald-50 hover:border-emerald-300"
                            onClick={() => {
                              loadSampleData("comprehensive")
                              document.querySelector('[data-state="open"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className="text-3xl">🏥</div>
                              <div className="flex-1">
                                <div className="font-semibold text-base mb-1">Medical Record</div>
                                <div className="text-sm text-slate-600 mb-2">
                                  Comprehensive healthcare document with 50+ PII types
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="secondary" className="text-xs">Patient Info</Badge>
                                  <Badge variant="secondary" className="text-xs">SSN</Badge>
                                  <Badge variant="secondary" className="text-xs">Medical IDs</Badge>
                                  <Badge variant="secondary" className="text-xs">+47 more</Badge>
                                </div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="h-auto p-4 text-left justify-start hover:bg-blue-50 hover:border-blue-300"
                            onClick={() => {
                              loadSampleData("financial")
                              document.querySelector('[data-state="open"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className="text-3xl">🏦</div>
                              <div className="flex-1">
                                <div className="font-semibold text-base mb-1">Financial Statement</div>
                                <div className="text-sm text-slate-600 mb-2">
                                  Banking and investment document with financial PII
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="secondary" className="text-xs">Account Numbers</Badge>
                                  <Badge variant="secondary" className="text-xs">Credit Cards</Badge>
                                  <Badge variant="secondary" className="text-xs">SSN</Badge>
                                  <Badge variant="secondary" className="text-xs">+15 more</Badge>
                                </div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="h-auto p-4 text-left justify-start hover:bg-purple-50 hover:border-purple-300"
                            onClick={() => {
                              loadSampleData("legal")
                              document.querySelector('[data-state="open"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className="text-3xl">⚖️</div>
                              <div className="flex-1">
                                <div className="font-semibold text-base mb-1">Legal Case Document</div>
                                <div className="text-sm text-slate-600 mb-2">
                                  Court case with plaintiff, defendant, and attorney info
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="secondary" className="text-xs">Case Numbers</Badge>
                                  <Badge variant="secondary" className="text-xs">Bar Numbers</Badge>
                                  <Badge variant="secondary" className="text-xs">SSN</Badge>
                                  <Badge variant="secondary" className="text-xs">+20 more</Badge>
                                </div>
                              </div>
                            </div>
                          </Button>

                          <Button
                            variant="outline"
                            className="h-auto p-4 text-left justify-start hover:bg-orange-50 hover:border-orange-300"
                            onClick={() => {
                              loadSampleData("hr")
                              document.querySelector('[data-state="open"]')?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
                            }}
                          >
                            <div className="flex items-start gap-3 w-full">
                              <div className="text-3xl">👤</div>
                              <div className="flex-1">
                                <div className="font-semibold text-base mb-1">Employee Record</div>
                                <div className="text-sm text-slate-600 mb-2">
                                  HR document with payroll, benefits, and personal data
                                </div>
                                <div className="flex flex-wrap gap-1">
                                  <Badge variant="secondary" className="text-xs">Employee ID</Badge>
                                  <Badge variant="secondary" className="text-xs">SSN</Badge>
                                  <Badge variant="secondary" className="text-xs">Bank Info</Badge>
                                  <Badge variant="secondary" className="text-xs">+25 more</Badge>
                                </div>
                              </div>
                            </div>
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".pdf,.docx,.txt,.jpg,.jpeg,.png,.gif,.xlsx,.csv"
                  />
                </div>
              </CardContent>
            </Card>

            {/* File Queue */}
            {files.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Processing Queue ({files.length} files)
                    </span>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleProcessDocuments}
                        className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600"
                        disabled={processing}
                      >
                        {processing ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Processing
                          </>
                        )}
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getFileIcon(file)}
                          <div>
                            <div className="font-medium text-slate-900">{file.name}</div>
                            <div className="text-sm text-slate-500">
                              {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || "Unknown type"}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeFile(index)} disabled={processing}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Brain,
                  title: "50+ PII Types",
                  description: "AI detects comprehensive range of sensitive information",
                  color: "from-emerald-500 to-teal-500",
                },
                {
                  icon: Target,
                  title: "Real-time Editing",
                  description: "Interactive preview with selective redaction and custom masking",
                  color: "from-blue-500 to-indigo-500",
                },
                {
                  icon: Zap,
                  title: "Batch Processing",
                  description: "Process multiple documents simultaneously with progress tracking",
                  color: "from-purple-500 to-pink-500",
                },
              ].map((feature, index) => (
                <Card key={index} className="border-0 bg-gradient-to-br from-white to-slate-50">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} mb-4`}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <div className="space-y-6">
            {/* Results Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    Redaction Results
                  </span>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                      <Edit3 className="h-4 w-4 mr-2" />
                      {editMode ? "View Mode" : "Edit Mode"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExportBatch}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Batch
                    </Button>
                    <Select
                      value={settings.exportFormat}
                      onValueChange={(value: any) => setSettings((prev) => ({ ...prev, exportFormat: value }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="txt">TXT</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="docx">DOCX</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => handleExportResult()}
                      className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600"
                      disabled={!results[selectedResult] || results[selectedResult].status !== "completed"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-600">
                      {results.reduce((sum, r) => sum + r.detections.filter((d: any) => d.enabled).length, 0)}
                    </div>
                    <div className="text-sm text-slate-600">Active Redactions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                    <div className="text-sm text-slate-600">Documents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {results.length > 0
                        ? ((results.reduce((sum, r) => sum + r.confidence, 0) / results.length) * 100).toFixed(1)
                        : 0}
                      %
                    </div>
                    <div className="text-sm text-slate-600">Avg Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {results.reduce((sum, r) => sum + r.processingTime, 0).toFixed(1)}s
                    </div>
                    <div className="text-sm text-slate-600">Total Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600">
                      {new Set(results.flatMap((r) => r.detections.map((d: any) => d.type))).size}
                    </div>
                    <div className="text-sm text-slate-600">PII Types</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* File Tabs */}
            {results.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex space-x-2 overflow-x-auto">
                    {results.map((result, index) => (
                      <Button
                        key={result.id}
                        variant={selectedResult === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedResult(index)}
                        className="whitespace-nowrap flex items-center gap-2"
                      >
                        {result.status === "processing" && <Clock className="h-3 w-3 animate-spin" />}
                        {result.status === "completed" && <CheckCircle className="h-3 w-3 text-emerald-600" />}
                        {result.status === "error" && <AlertTriangle className="h-3 w-3 text-red-600" />}
                        <span>{result.fileName}</span>
                        {result.status === "processing" && (
                          <Badge variant="secondary" className="ml-1">
                            {result.progress}%
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Progress */}
            {processing && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 animate-pulse" />
                    AI Processing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {results.map((result, index) => (
                    <div key={result.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{result.fileName}</span>
                        <span className="text-sm text-slate-600">{result.progress}%</span>
                      </div>
                      <Progress value={result.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Document Preview */}
            {results[selectedResult] && results[selectedResult].status === "completed" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Original Document */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Original Document
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(results[selectedResult].originalText)
                          toast.success("Original text copied to clipboard!")
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                        {results[selectedResult].originalText}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Redacted Document */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Shield className="h-5 w-5 text-emerald-600" />
                        Redacted Document
                      </span>
                      <div className="flex items-center gap-2">
                        {editMode && (
                          <>
                            <Button variant="outline" size="sm" disabled>
                              <Undo className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" disabled>
                              <Redo className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(results[selectedResult].redactedText)
                            toast.success("Redacted text copied to clipboard!")
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-slate-50 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="text-sm text-slate-800 whitespace-pre-wrap font-mono">
                        {results[selectedResult].redactedText}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* PII Analysis */}
            {results[selectedResult] && results[selectedResult].status === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      PII Analysis ({results[selectedResult].detections.length} detections)
                    </span>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const auditData = {
                            fileName: results[selectedResult].fileName,
                            timestamp: new Date().toISOString(),
                            detections: results[selectedResult].detections,
                            settings: settings,
                            metadata: {
                              processingTime: results[selectedResult].processingTime,
                              confidence: results[selectedResult].confidence,
                              fileSize: results[selectedResult].fileSize,
                            },
                          }
                          const element = document.createElement("a")
                          const file = new Blob([JSON.stringify(auditData, null, 2)], { type: "application/json" })
                          element.href = URL.createObjectURL(file)
                          element.download = `${results[selectedResult].fileName}-audit.json`
                          document.body.appendChild(element)
                          element.click()
                          document.body.removeChild(element)
                          toast.success("Audit report downloaded!")
                        }}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Export Audit
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {results[selectedResult].detections.map((detection: any, index: number) => (
                      <div
                        key={detection.id}
                        className={`p-4 rounded-lg border transition-all ${
                          detection.enabled
                            ? "bg-slate-50 border-slate-200"
                            : "bg-slate-100 border-slate-300 opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <input
                              type="checkbox"
                              checked={detection.enabled}
                              onChange={() => toggleDetection(selectedResult, detection.id)}
                              className="mt-1"
                              disabled={!editMode}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  variant={
                                    detection.riskLevel === "CRITICAL"
                                      ? "destructive"
                                      : detection.riskLevel === "HIGH"
                                        ? "default"
                                        : detection.riskLevel === "MEDIUM"
                                          ? "secondary"
                                          : "outline"
                                  }
                                >
                                  {detection.type}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {(detection.confidence * 100).toFixed(1)}%
                                </Badge>
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    detection.riskLevel === "CRITICAL"
                                      ? "bg-red-500"
                                      : detection.riskLevel === "HIGH"
                                        ? "bg-orange-500"
                                        : detection.riskLevel === "MEDIUM"
                                          ? "bg-yellow-500"
                                          : "bg-green-500"
                                  }`}
                                />
                              </div>
                              <div className="space-y-2">
                                <div className="font-mono text-sm">
                                  <span className="text-slate-600">Original: </span>
                                  <span className="bg-red-100 px-1 rounded">{detection.text}</span>
                                </div>
                                <div className="font-mono text-sm">
                                  <span className="text-slate-600">Redacted: </span>
                                  <span className="bg-green-100 px-1 rounded">
                                    {detection.customRedaction || detection.redacted}
                                  </span>
                                </div>
                                {editMode && (
                                  <div className="flex items-center gap-2">
                                    <Input
                                      placeholder="Custom redaction..."
                                      value={detection.customRedaction || ""}
                                      onChange={(e) =>
                                        updateCustomRedaction(selectedResult, detection.id, e.target.value)
                                      }
                                      className="text-sm font-mono"
                                      size={20}
                                    />
                                  </div>
                                )}
                                {detection.contextBefore && (
                                  <div className="text-xs text-slate-500">
                                    <span className="font-medium">Context: </span>
                                    ...{detection.contextBefore} <strong>{detection.text}</strong>{" "}
                                    {detection.contextAfter}...
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Risk Analysis Dashboard */}
            {results[selectedResult] && results[selectedResult].status === "completed" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Risk Analysis Dashboard
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((level) => {
                      const count = results[selectedResult].detections.filter((d: any) => d.riskLevel === level).length
                      const color =
                        level === "CRITICAL"
                          ? "text-red-600 bg-red-50"
                          : level === "HIGH"
                            ? "text-orange-600 bg-orange-50"
                            : level === "MEDIUM"
                              ? "text-yellow-600 bg-yellow-50"
                              : "text-green-600 bg-green-50"
                      return (
                        <div key={level} className={`text-center p-4 rounded-lg ${color}`}>
                          <div className="text-2xl font-bold">{count}</div>
                          <div className="text-sm font-medium">{level} Risk</div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(
                      results[selectedResult].detections.reduce(
                        (acc: any, detection: any) => {
                          acc[detection.type] = (acc[detection.type] || 0) + 1
                          return acc
                        },
                        {} as Record<string, number>,
                      ),
                    )
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .slice(0, 12)
                      .map(([type, count]) => (
                        <div key={type} className="text-center p-3 bg-slate-50 rounded-lg">
                          <div className="text-lg font-bold text-slate-900">{count as number}</div>
                          <div className="text-xs text-slate-600">{type.replace(/_/g, " ")}</div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleReset} variant="outline">
                <RefreshCw className="h-5 w-5 mr-2" />
                Process New Documents
              </Button>
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600"
                onClick={() => handleExportResult()}
                disabled={!results[selectedResult] || results[selectedResult].status !== "completed"}
              >
                <Download className="h-5 w-5 mr-2" />
                Download {settings.exportFormat.toUpperCase()}
              </Button>
              <Button size="lg" variant="outline" onClick={handleExportBatch} disabled={results.length === 0}>
                <Save className="h-5 w-5 mr-2" />
                Export Batch Results
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
