"use client"

import { Card } from "@/components/ui/card"
import { Clock, MapPin } from "lucide-react"

export default function RecentUploads() {
  const uploads = [
    {
      id: 1,
      location: "Riau Province",
      date: "Today, 2:45 PM",
      result: "Fire Detected",
      confidence: 94,
      status: "high",
    },
    {
      id: 2,
      location: "Sumatra Region",
      date: "Today, 1:20 PM",
      result: "No Fire",
      confidence: 98,
      status: "low",
    },
    {
      id: 3,
      location: "South Sumatra",
      date: "Yesterday, 4:15 PM",
      result: "Fire Detected",
      confidence: 87,
      status: "high",
    },
    {
      id: 4,
      location: "Jambi Province",
      date: "Yesterday, 10:30 AM",
      result: "No Fire",
      confidence: 96,
      status: "low",
    },
  ]

  return (
    <Card className="p-6 border-border dark:border-slate-800">
      <h3 className="text-lg font-semibold mb-4">Recent Uploads</h3>
      <div className="space-y-3">
        {uploads.map((upload) => (
          <div
            key={upload.id}
            className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{upload.location}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {upload.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${upload.status === "high" ? "text-primary" : "text-alert-low"}`}>
                {upload.result}
              </p>
              <p className="text-xs text-muted-foreground">{upload.confidence}% confidence</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
