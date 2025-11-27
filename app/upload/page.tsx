"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ImageUploadCard from "@/components/image-upload-card"
import DetectionResult from "@/components/detection-result"
import QuickStartGuide from "@/components/quick-start-guide"
import UploadGuidelines from "@/components/upload-guidelines"
import RecentUploads from "@/components/recent-uploads"
import DetectionTips from "@/components/detection-tips"
import AIExplanationPanel from "@/components/ai-explanation-panel"

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDetecting, setIsDetecting] = useState(false)
  const [detectionResult, setDetectionResult] = useState<{
    fireDetected: boolean
    confidence: number
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setUploadedImage(event.target?.result as string)
        setDetectionResult(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRunDetection = async () => {
    setIsDetecting(true)
    // Simulate AI detection
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const fireDetected = Math.random() > 0.4
    const confidence = Math.floor(Math.random() * 30 + 70)

    // Mock detection details
    const detectionDetails = {
      fireDetected,
      confidence,
      detectedObjects: fireDetected ? ["Fire", "Smoke", "Flames"] : [],
      affectedArea: fireDetected ? `${Math.floor(Math.random() * 40 + 10)}% of image` : "0%",
      processingTime: `${Math.floor(Math.random() * 1000 + 500)}ms`,
      imageQuality: ["Good", "Excellent", "Fair"][Math.floor(Math.random() * 3)],
      lightingConditions: ["Daytime", "Nighttime", "Low Light"][Math.floor(Math.random() * 3)],
      recommendations: fireDetected
        ? [
            "Verify detection with visual inspection",
            "Check surrounding areas for additional fire sources",
            "Ensure proper evacuation procedures are in place",
            "Contact emergency services if fire is confirmed",
          ]
        : ["Image analysis complete", "No fire or smoke detected", "Safe to proceed with normal operations"],
    }

    setDetectionResult(detectionDetails)
    setIsDetecting(false)
  }

  const handleClearImage = () => {
    setUploadedImage(null)
    setDetectionResult(null)
  }

  const handleAnalyzeAnother = () => {
    setUploadedImage(null)
    setDetectionResult(null)
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Fire Detection</h1>
          <p className="text-lg text-muted-foreground">
            Upload an image to detect potential fire and smoke using our AI model.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Upload Section - Takes 1 column */}
          <div className="lg:col-span-1 space-y-6">
            <ImageUploadCard
              uploadedImage={uploadedImage}
              onUpload={() => fileInputRef.current?.click()}
              isDetecting={isDetecting}
              onClear={uploadedImage ? handleClearImage : undefined}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {uploadedImage && (
              <Button
                onClick={handleRunDetection}
                disabled={isDetecting}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isDetecting ? (
                  <>
                    <div className="animate-spin mr-2 w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Run Detection
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Results Section - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {detectionResult ? (
              <>
                <DetectionResult result={detectionResult} onAnalyzeAnother={handleAnalyzeAnother} />
                <AIExplanationPanel
                  fireDetected={detectionResult.fireDetected}
                  confidence={detectionResult.confidence}
                />
              </>
            ) : uploadedImage ? (
              <Card className="p-8 border-dashed border-2 border-border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Click "Run Detection" to analyze the image</p>
                </div>
              </Card>
            ) : (
              <Card className="p-8 border-dashed border-2 border-border flex items-center justify-center min-h-64">
                <div className="text-center">
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Upload an image to get started</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-16 space-y-8">
          <QuickStartGuide />
          <UploadGuidelines />
          <div className="grid lg:grid-cols-2 gap-6">
            <RecentUploads />
            <DetectionTips />
          </div>
        </div>
      </div>
    </div>
  )
}
