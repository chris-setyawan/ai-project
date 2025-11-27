"use client"

import { Card } from "@/components/ui/card"
import { Bell, AlertTriangle, Radio } from "lucide-react"

interface Alert {
  id: number
  time: string
  message: string
  icon: "bell" | "warning" | "update"
}

const alerts: Alert[] = [
  {
    id: 1,
    time: "11:05",
    message: "New fire hotspot detected in Riau Province (95%)",
    icon: "bell",
  },
  {
    id: 2,
    time: "10:42",
    message: 'Risk in Riau increased to "High"',
    icon: "warning",
  },
  {
    id: 3,
    time: "09:58",
    message: "Model updated with latest weather data",
    icon: "update",
  },
]

function getAlertIcon(type: string) {
  switch (type) {
    case "bell":
      return <Bell className="w-4 h-4 text-alert-info" />
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-alert-medium" />
    case "update":
      return <Radio className="w-4 h-4 text-alert-low" />
    default:
      return null
  }
}

export default function RecentAlertsLog() {
  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-border dark:border-slate-600 shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-foreground mb-4">Recent Activity Log</h3>
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.map((alert, idx) => (
          <div
            key={alert.id}
            className="flex items-start gap-3 p-3 bg-muted dark:bg-slate-700/50 rounded-lg border border-border dark:border-slate-600 animate-fade-in"
            style={{
              animationDelay: `${idx * 100}ms`,
            }}
          >
            <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.icon)}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-muted-foreground">[{alert.time}]</p>
              <p className="text-sm text-foreground">{alert.message}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
