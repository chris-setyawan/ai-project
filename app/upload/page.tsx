"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Upload, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import ImageUploadCard from "@/components/image-upload-card"
import DetectionResult from "@/components/detection-result"
import QuickStartGuide from "@/components/quick-start-guide"
import UploadGuidelines from "@/components/upload-guidelines"
import RecentUploads from "@/components/recent-uploads"
import DetectionTips from "@/components/detection-tips"
import AIExplanationPanel from "@/components/ai-explanation-panel"
import { useFireDetection } from "@/hooks/use-fire-detection"

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [detectionResult, setDetectionResult] = useState<any>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { detectFire, isModelLoading, isDetecting, modelReady } = useFireDetection()

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File", {
          description: "Please upload an image file (PNG, JPG, GIF)",
        })
        return
      }

      if (file.size > 10 * 1024 * 1024) {
        toast.error("File Too Large", {
          description: "Please upload an image smaller than 10MB",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setUploadedImage(imageUrl)
        setDetectionResult(null)

        const img = new Image()
        img.onload = () => {
          setImageElement(img)
        }
        img.src = imageUrl
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRunDetection = async () => {
    if (!imageElement) {
      toast.error("No Image", {
        description: "Please upload an image first",
      })
      return
    }

    if (!modelReady) {
      toast.error("Model Loading", {
        description: "AI model is still loading. Please wait...",
      })
      return
    }

    try {
      const result = await detectFire(imageElement)
      setDetectionResult(result)

      toast.success("Detection Complete", {
        description: result.fireDetected
          ? `Fire detected with ${result.confidence}% confidence`
          : "No fire detected in image",
      })
    } catch (error) {
      console.error("Detection error:", error)
      toast.error("Detection Failed", {
        description: "An error occurred during detection. Please try again.",
      })
    }
  }

  const handleClearImage = () => {
    setUploadedImage(null)
    setDetectionResult(null)
    setImageElement(null)
  }

  const handleAnalyzeAnother = () => {
    setUploadedImage(null)
    setDetectionResult(null)
    setImageElement(null)
    fileInputRef.current?.click()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Fire Detection</h1>
          <p className="text-lg text-muted-foreground">
            Upload an image to detect potential fire and smoke using our AI model powered by TensorFlow.js
          </p>
          
          {isModelLoading && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading AI model... Please wait.</span>
            </div>
          )}
          {modelReady && (
            <div className="mt-4 flex items-center gap-2 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
              <span>AI Model Ready</span>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 space-y-6">
            <ImageUploadCard
              uploadedImage={uploadedImage}
              onUpload={() => fileInputRef.current?.click()}
              isDetecting={isDetecting}
              onClear={uploadedImage ? handleClearImage : undefined}
              boundingBoxes={detectionResult?.boundingBoxes || []}
              imageSize={imageElement ? { width: imageElement.width, height: imageElement.height } : undefined}
            />

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />

            {uploadedImage && (
              <Button
                onClick={handleRunDetection}
                disabled={isDetecting || !modelReady || isModelLoading}
                size="lg"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                {isDetecting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing with AI...
                  </>
                ) : isModelLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading Model...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Run AI Detection
                  </>
                )}
              </Button>
            )}

            {uploadedImage && !isDetecting && modelReady && (
              <Card className="p-4 bg-blue-50 border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Ready to detect:</strong> Click "Run AI Detection" to analyze this image for fire and
                  smoke patterns using TensorFlow.js object detection.
                </p>
              </Card>
            )}
          </div>

          <div className="lg:col-span-2 space-y-6">
            {detectionResult ? (
              <>
                <DetectionResult result={detectionResult} onAnalyzeAnother={handleAnalyzeAnother} />
                <AIExplanationPanel
                  fireDetected={detectionResult.fireDetected}
                  confidence={detectionResult.confidence}
                />

                {detectionResult.detectedObjects?.length > 0 && (
                  <Card className="p-6 bg-card border-border">
                    <h3 className="font-semibold text-lg mb-4">Detected Objects</h3>
                    <div className="flex flex-wrap gap-2">
                      {detectionResult.detectedObjects.map((obj: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                        >
                          {obj}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : uploadedImage ? (
              <Card className="p-8 border-dashed border-2 border-border flex items-center justify-center min-h-96">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    {isModelLoading
                      ? "AI model is loading... Please wait."
                      : 'Click "Run AI Detection" to analyze the image'}
                  </p>
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