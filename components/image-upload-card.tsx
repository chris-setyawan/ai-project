"use client"

import { Upload, X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"
import { useState } from "react"

interface ImageUploadCardProps {
  uploadedImage: string | null
  onUpload: () => void
  isDetecting: boolean
  onClear?: () => void
}

export default function ImageUploadCard({ uploadedImage, onUpload, isDetecting, onClear }: ImageUploadCardProps) {
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleUploadClick = () => {
    if (!uploadedImage) {
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 30
        })
      }, 200)
    }
    onUpload()
  }

  return (
    <Card
      onClick={!uploadedImage ? handleUploadClick : undefined}
      className={`relative overflow-hidden border-2 border-dashed transition-all ${
        uploadedImage
          ? "border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5"
          : "border-border hover:border-primary/50 cursor-pointer hover:bg-muted/50"
      }`}
    >
      {uploadedImage ? (
        <div className="relative w-full h-96">
          <Image src={uploadedImage || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover" />

          {!isDetecting && (
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <rect
                x="20%"
                y="30%"
                width="30%"
                height="25%"
                fill="none"
                stroke="#F44336"
                strokeWidth="2"
                opacity="0.7"
              />
              <rect
                x="55%"
                y="45%"
                width="25%"
                height="20%"
                fill="none"
                stroke="#FF9800"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>
          )}

          {isDetecting && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          )}

          <div className="absolute top-4 right-4 flex gap-2">
            {onClear && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setUploadProgress(0)
                  onClear()
                }}
                className="p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleUploadClick()
              }}
              className="p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
            >
              <Upload className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center">
          <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="font-semibold mb-2">Click to upload image</p>
          <p className="text-sm text-muted-foreground">or drag and drop</p>
          <p className="text-xs text-muted-foreground mt-4">PNG, JPG, GIF up to 10MB</p>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-6 space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{Math.round(uploadProgress)}% uploaded</p>
            </div>
          )}
        </div>
      )}
    </Card>
  )
}
