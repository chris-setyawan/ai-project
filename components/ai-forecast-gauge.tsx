"use client"

import { Card } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"

export default function AIForecastGauge() {
  const riskPercentage = 82
  const circumference = 2 * Math.PI * 45

  const getRiskColor = (percentage: number) => {
    if (percentage >= 80) return "rgb(var(--color-alert-high))"
    if (percentage >= 60) return "rgb(var(--color-alert-medium))"
    return "rgb(var(--color-alert-low))"
  }

  const getRiskLabel = (percentage: number) => {
    if (percentage >= 80) return "High"
    if (percentage >= 60) return "Medium"
    return "Low"
  }

  const strokeDashoffset = circumference - (riskPercentage / 100) * circumference

  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-border dark:border-slate-600 shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-6">Fire Risk Prediction (Next 24 Hours)</h3>

      <div className="flex flex-col items-center justify-center">
        <div className="relative w-32 h-32 mb-4">
          <svg width="128" height="128" viewBox="0 0 128 128" className="transform -rotate-90">
            <circle cx="64" cy="64" r="45" fill="none" stroke="hsl(var(--color-border))" strokeWidth="8" />
            <circle
              cx="64"
              cy="64"
              r="45"
              fill="none"
              stroke={riskPercentage >= 80 ? "#E64A19" : riskPercentage >= 60 ? "#F57C00" : "#388E3C"}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-foreground">{riskPercentage}%</p>
            <p className="text-sm font-semibold text-muted-foreground">{getRiskLabel(riskPercentage)}</p>
          </div>
        </div>

        <div className="flex items-start gap-2 mt-4 p-3 bg-alert-high/10 dark:bg-alert-high/20 rounded-lg border border-alert-high/30 dark:border-alert-high/40">
          <AlertTriangle className="w-4 h-4 text-alert-high dark:text-alert-high flex-shrink-0 mt-0.5" />
          <p className="text-xs text-alert-high dark:text-alert-high">
            Based on temperature patterns, humidity, and fire detection, this area has the potential to experience fire
            within the next 24 hours.
          </p>
        </div>
      </div>
    </Card>
  )
}
