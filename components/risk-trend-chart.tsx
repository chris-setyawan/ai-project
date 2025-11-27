"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card } from "@/components/ui/card"

const riskTrendData = [
  { day: "Mon", risk: 60 },
  { day: "Tue", risk: 65 },
  { day: "Wed", risk: 72 },
  { day: "Thu", risk: 78 },
  { day: "Fri", risk: 85 },
  { day: "Sat", risk: 88 },
  { day: "Sun", risk: 92 },
]

export default function RiskTrendChart() {
  return (
    <Card className="p-6 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 shadow-sm rounded-xl">
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tren Risiko Kebakaran (7 Hari Terakhir)</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={riskTrendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" stroke="#64748b" />
          <YAxis stroke="#64748b" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              color: "#1e293b",
            }}
          />
          <Line
            type="monotone"
            dataKey="risk"
            stroke="#FF9800"
            strokeWidth={2}
            dot={{ fill: "#FF9800", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-xs text-slate-600 dark:text-slate-400 mt-4 text-center">
        Model AI memprediksi peningkatan risiko di area ini dalam beberapa hari terakhir.
      </p>
    </Card>
  )
}
