"use client"

import { Card } from "@/components/ui/card"

export default function DetectionTips() {
  const tips = [
    {
      title: "Image Quality",
      description: "Higher resolution images (1080p+) provide better detection accuracy",
    },
    {
      title: "Lighting Conditions",
      description: "Daytime images with natural lighting work best for fire detection",
    },
    {
      title: "Smoke Visibility",
      description: "Clear smoke plumes are easier to detect than faint smoke",
    },
    {
      title: "Multiple Angles",
      description: "Upload images from different angles for comprehensive analysis",
    },
  ]

  return (
    <Card className="p-6 bg-card border-border">
      <h3 className="text-lg font-semibold mb-6 text-foreground">Tips for Better Detection</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 border border-primary/20">
              <span className="font-semibold text-primary text-sm">{index + 1}</span>
            </div>
            <div>
              <p className="font-medium text-sm text-foreground">{tip.title}</p>
              <p className="text-xs text-muted-foreground">{tip.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
