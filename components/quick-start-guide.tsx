"use client"

import { Card } from "@/components/ui/card"

export default function QuickStartGuide() {
  const steps = [
    {
      number: "1",
      title: "Upload Image",
      description: "Click the upload area or drag and drop an image of the forest area",
    },
    {
      number: "2",
      title: "Run Detection",
      description: "Click 'Run Detection' to analyze the image using our AI model",
    },
    {
      number: "3",
      title: "Get Results",
      description: "View confidence scores and fire detection results instantly",
    },
    {
      number: "4",
      title: "View Analytics",
      description: "Check the dashboard to see trends and hotspot locations",
    },
  ]

  return (
    <Card className="p-8 bg-card border-border">
      <h2 className="text-2xl font-bold mb-6 text-foreground">Quick Start Guide</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 border border-primary/20">
              <span className="font-semibold text-primary text-lg">{step.number}</span>
            </div>
            <h3 className="font-semibold mb-2 text-foreground">{step.title}</h3>
            <p className="text-sm text-muted-foreground">{step.description}</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
