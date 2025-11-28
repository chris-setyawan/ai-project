"use client"

import { AlertCircle, CheckCircle, Flame, Wind } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface DetectionResultProps {
  result: {
    fireDetected: boolean
    confidence: number
    detectionType?: "Fire" | "Smoke" | "No Fire"
  }
  onAnalyzeAnother?: () => void
}

export default function DetectionResult({ result, onAnalyzeAnother }: DetectionResultProps) {
  const [displayedConfidence, setDisplayedConfidence] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      current += Math.ceil(result.confidence / 20)
      if (current >= result.confidence) {
        setDisplayedConfidence(result.confidence)
        clearInterval(interval)
      } else {
        setDisplayedConfidence(current)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [result.confidence])

  const getIcon = () => {
    if (!result.fireDetected) {
      return <CheckCircle className="w-8 h-8 text-green-600" />
    }
    if (result.detectionType === "Fire") {
      return <Flame className="w-8 h-8 text-red-600" />
    }
    if (result.detectionType === "Smoke") {
      return <Wind className="w-8 h-8 text-gray-600" />
    }
    return <AlertCircle className="w-8 h-8 text-orange-600" />
  }

  const getTitle = () => {
    if (!result.fireDetected) return "No Fire Detected"
    if (result.detectionType === "Fire") return "🔥 Fire Detected!"
    if (result.detectionType === "Smoke") return "💨 Smoke Detected!"
    return "⚠️ Fire/Smoke Detected"
  }

  const getColorClass = () => {
    if (!result.fireDetected) {
      return "border-green-500/50 bg-gradient-to-br from-green-50 to-emerald-50"
    }
    if (result.detectionType === "Fire") {
      return "border-red-500/50 bg-gradient-to-br from-red-50 to-orange-50"
    }
    if (result.detectionType === "Smoke") {
      return "border-gray-500/50 bg-gradient-to-br from-gray-50 to-slate-50"
    }
    return "border-orange-500/50 bg-gradient-to-br from-orange-50 to-amber-50"
  }

  const getIconBgClass = () => {
    if (!result.fireDetected) return "bg-green-100"
    if (result.detectionType === "Fire") return "bg-red-100"
    if (result.detectionType === "Smoke") return "bg-gray-100"
    return "bg-orange-100"
  }

  const getProgressClass = () => {
    if (!result.fireDetected) return "bg-gradient-to-r from-green-500 to-emerald-500"
    if (result.detectionType === "Fire") return "bg-gradient-to-r from-red-500 to-orange-500"
    if (result.detectionType === "Smoke") return "bg-gradient-to-r from-gray-500 to-slate-500"
    return "bg-gradient-to-r from-orange-500 to-amber-500"
  }

  const getRiskColor = () => {
    if (!result.fireDetected) return "text-green-600"
    if (result.detectionType === "Fire") return "text-red-600"
    if (result.detectionType === "Smoke") return "text-gray-700"
    return "text-orange-600"
  }

  return (
    <div className="space-y-4">
      <Card className={`p-8 border-2 ${getColorClass()}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${getIconBgClass()}`}>
            {getIcon()}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{getTitle()}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${getProgressClass()}`}
                      style={{ width: `${displayedConfidence}%` }}
                    />
                  </div>
                  <span className="font-semibold text-lg">{displayedConfidence}%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Detection Type</p>
                  <p className="font-semibold">
                    {result.detectionType || (result.fireDetected ? "Fire/Smoke" : "Clear")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                  <p className={`font-semibold ${getRiskColor()}`}>
                    {!result.fireDetected
                      ? "Low"
                      : result.detectionType === "Fire"
                        ? "Critical"
                        : "High"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
      {onAnalyzeAnother && (
        <Button onClick={onAnalyzeAnother} variant="outline" className="w-full bg-transparent">
          Analyze Another Image
        </Button>
      )}
    </div>
  )
}