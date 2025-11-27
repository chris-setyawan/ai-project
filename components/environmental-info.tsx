"use client"

import { Card } from "@/components/ui/card"
import { Cloud, Droplets, Wind, Thermometer } from "lucide-react"

export default function EnvironmentalInfo() {
  const envData = [
    { icon: Thermometer, label: "Average Temperature", value: "34°C", color: "text-alert-high" },
    { icon: Droplets, label: "Air Humidity", value: "42%", color: "text-alert-info" },
    { icon: Wind, label: "Wind Speed", value: "12 km/h", color: "text-secondary" },
    { icon: Cloud, label: "Weather", value: "Clear Hazy", color: "text-alert-medium" },
  ]

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-border dark:border-slate-600 shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">Environmental Information</h3>
      <div className="grid grid-cols-2 gap-4">
        {envData.map((item, idx) => {
          const Icon = item.icon
          return (
            <div key={idx} className="flex items-center gap-3 p-3 bg-muted dark:bg-slate-700/50 rounded-lg">
              <Icon className={`w-5 h-5 ${item.color}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-semibold text-foreground text-sm">{item.value}</p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
