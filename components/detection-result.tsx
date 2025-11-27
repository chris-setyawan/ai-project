"use client"

import { AlertCircle, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

interface DetectionResultProps {
  result: {
    fireDetected: boolean
    confidence: number
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

  return (
    <div className="space-y-4">
      <Card
        className={`p-8 border-2 ${result.fireDetected ? "border-primary/50 bg-gradient-to-br from-primary/5 to-secondary/5" : "border-alert-low/50 bg-gradient-to-br from-alert-low/5 to-accent/5"}`}
      >
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-lg ${result.fireDetected ? "bg-primary/20" : "bg-alert-low/20"}`}>
            {result.fireDetected ? (
              <AlertCircle className="w-8 h-8 text-primary" />
            ) : (
              <CheckCircle className="w-8 h-8 text-alert-low" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-2">{result.fireDetected ? "Fire Detected" : "No Fire Detected"}</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Confidence Score</p>
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all ${result.fireDetected ? "bg-gradient-to-r from-primary to-secondary" : "bg-gradient-to-r from-alert-low to-accent"}`}
                      style={{ width: `${displayedConfidence}%` }}
                    />
                  </div>
                  <span className="font-semibold text-lg">{displayedConfidence}%</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Detection Type</p>
                  <p className="font-semibold">{result.fireDetected ? "Fire/Smoke" : "Clear"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Risk Level</p>
                  <p className={`font-semibold ${result.fireDetected ? "text-primary" : "text-alert-low"}`}>
                    {result.fireDetected ? "High" : "Low"}
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
