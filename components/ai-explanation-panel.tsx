"use client"

import { Card } from "@/components/ui/card"

interface AIExplanationPanelProps {
  fireDetected: boolean
  confidence: number
}

export default function AIExplanationPanel({ fireDetected, confidence }: AIExplanationPanelProps) {
  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="font-semibold text-lg mb-4">AI Detection Analysis</h3>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-2">Detection Result</p>
          <p className="font-medium text-foreground">
            {fireDetected ? "Fire and smoke patterns detected in the image" : "No fire or smoke patterns detected"}
          </p>
        </div>

        <div>
          <p className="text-sm text-muted-foreground mb-2">Confidence Level</p>
          <p className="font-medium text-foreground">{confidence}% confidence in this detection</p>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground mb-3">How the AI Works</p>
          <ul className="space-y-2 text-sm text-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Analyzes pixel patterns and color distributions typical of fire and smoke</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Uses YOLOv8 deep learning model trained on thousands of fire images</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Identifies smoke plumes, flames, and heat signatures</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>Provides confidence score based on detection certainty</span>
            </li>
          </ul>
        </div>

        {fireDetected && (
          <div className="pt-4 border-t border-border bg-alert-high/10 dark:bg-alert-high/20 p-4 rounded-lg">
            <p className="text-sm font-medium text-alert-high dark:text-alert-high mb-2">Alert</p>
            <p className="text-sm text-alert-high dark:text-alert-high">
              Fire detected with {confidence}% confidence. Please verify with visual inspection and take appropriate
              action.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}
