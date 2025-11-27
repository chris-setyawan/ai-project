"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, TrendingUp, Globe, Clock, AlertTriangle, Flame, Download, MapIcon } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "@/hooks/use-toast"
import AnimatedCounter from "@/components/animated-counter"
import EnvironmentalInfo from "@/components/environmental-info"
import AIForecastGauge from "@/components/ai-forecast-gauge"
import RecentAlertsLog from "@/components/recent-alerts-log"
import InteractiveFireMap from "@/components/interactive-fire-map"

interface Hotspot {
  id: number
  location: string
  confidence: number
  detectionTime: string
  riskLevel: "Low" | "Medium" | "High"
  latitude: number
  longitude: number
  region: "Sumatra"
}

const mockHotspots: Hotspot[] = [
  {
    id: 1,
    location: "Riau Province, Sumatra",
    confidence: 94,
    detectionTime: "2 hours ago",
    riskLevel: "High",
    latitude: 0.5,
    longitude: 101.0,
    region: "Sumatra",
  },
  {
    id: 3,
    location: "Jambi Province, Sumatra",
    confidence: 76,
    detectionTime: "6 hours ago",
    riskLevel: "Medium",
    latitude: -1.5,
    longitude: 103.0,
    region: "Sumatra",
  },
  {
    id: 5,
    location: "North Sumatra",
    confidence: 58,
    detectionTime: "12 hours ago",
    riskLevel: "Low",
    latitude: 2.0,
    longitude: 99.0,
    region: "Sumatra",
  },
]

const trendData = [
  { day: "Mon", fires: 2 },
  { day: "Tue", fires: 3 },
  { day: "Wed", fires: 5 },
  { day: "Thu", fires: 4 },
  { day: "Fri", fires: 7 },
  { day: "Sat", fires: 6 },
  { day: "Sun", fires: 5 },
]

function getRiskColor(level: string) {
  switch (level) {
    case "High":
      return "bg-red-100 text-red-700 border-red-300"
    case "Medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-300"
    case "Low":
      return "bg-green-100 text-green-700 border-green-300"
    default:
      return "bg-gray-100 text-gray-700"
  }
}

export default function DashboardPage() {
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(mockHotspots[0])
  const [mapZoomTrigger, setMapZoomTrigger] = useState<number>(0)
  const mapRef = useRef<HTMLDivElement>(null)
  const filteredHotspots = mockHotspots
  const highRiskCount = mockHotspots.filter((h) => h.riskLevel === "High").length

  const handleViewDetailOnMap = () => {
    if (selectedHotspot) {
      console.log("[v0] View Detail on Map triggered for:", selectedHotspot.location)
      // Trigger aggressive zoom animation in map component
      setMapZoomTrigger((prev) => prev + 1)

      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.scrollIntoView({ behavior: "smooth", block: "center" })
        }
      }, 100)
    }
  }

  const handleDownloadReport = () => {
    if (!selectedHotspot) return

    const locationName = selectedHotspot.location.split(",")[0].trim()
    const today = new Date()
    const dateStr = `${today.getDate()}_${String(today.getMonth() + 1).padStart(2, "0")}_${today.getFullYear()}`
    const reportFilename = `iFire_Report_${locationName}_${dateStr}.pdf`

    const reportContent = `
================================================================================
                        iFIRE FIRE DETECTION REPORT
================================================================================

Report Generated: ${today.toLocaleString()}

SELECTED HOTSPOT DETAILS
------------------------
Location: ${selectedHotspot.location}
Risk Level: ${selectedHotspot.riskLevel}
Confidence: ${selectedHotspot.confidence}%
Detection Time: ${selectedHotspot.detectionTime}
Coordinates: ${selectedHotspot.latitude.toFixed(2)}, ${selectedHotspot.longitude.toFixed(2)}

SUMMARY STATISTICS
------------------
Total Detections: ${mockHotspots.length}
High Risk Areas: ${mockHotspots.filter((h) => h.riskLevel === "High").length}
Medium Risk Areas: ${mockHotspots.filter((h) => h.riskLevel === "Medium").length}
Low Risk Areas: ${mockHotspots.filter((h) => h.riskLevel === "Low").length}

ALL HOTSPOTS
------------
${mockHotspots.map((h) => `• ${h.location} - Risk: ${h.riskLevel} (${h.confidence}%)`).join("\n")}

================================================================================
Data simulated for demonstration — powered by AI Computer Vision.
================================================================================
  `.trim()

    try {
      const blob = new Blob([reportContent], { type: "text/plain;charset=utf-8" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.setAttribute("href", url)
      link.setAttribute("download", reportFilename)
      link.style.cssText = "display:none"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      console.log("[v0] Download completed:", reportFilename)

      toast({
        title: "Report Downloaded Successfully",
        description: `Report for ${locationName} (Risk: ${selectedHotspot.riskLevel}) downloaded successfully.`,
      })
    } catch (error) {
      console.error("[v0] Download failed:", error)
      toast({
        title: "Download Failed",
        description: "Unable to download the report. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-8 h-8 text-orange-500" />
            <h1 className="text-4xl font-bold text-slate-900">Fire Hotspots Dashboard</h1>
          </div>
          <p className="text-lg text-slate-600">Real-time monitoring of detected fire hotspots in Sumatra.</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Detections</p>
                <p className="text-3xl font-bold text-slate-900">
                  <AnimatedCounter value={mockHotspots.length} />
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Active Hotspots</p>
                <p className="text-3xl font-bold text-slate-900">
                  <AnimatedCounter value={filteredHotspots.length} />
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">High-Risk Areas</p>
                <p className="text-3xl font-bold text-slate-900">
                  <AnimatedCounter value={highRiskCount} />
                </p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Last Updated</p>
                <p className="text-lg font-bold text-slate-900">2 min ago</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Map Section */}
          <div className="lg:col-span-2" ref={mapRef}>
            <InteractiveFireMap
              hotspots={filteredHotspots}
              selectedHotspot={selectedHotspot}
              onHotspotSelect={setSelectedHotspot}
              zoomTrigger={mapZoomTrigger}
            />
          </div>

          {/* Hotspots List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Detected Hotspots</h2>
            </div>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {filteredHotspots.map((hotspot) => (
                <Card
                  key={hotspot.id}
                  onClick={() => setSelectedHotspot(hotspot)}
                  className={`p-4 cursor-pointer transition-all border-2 bg-white ${
                    selectedHotspot?.id === hotspot.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-slate-200 hover:border-orange-300"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm truncate text-slate-900">{hotspot.location}</p>
                          <p className="text-xs text-slate-500">{hotspot.detectionTime}</p>
                        </div>
                      </div>
                      <Badge className={`${getRiskColor(hotspot.riskLevel)} border`}>{hotspot.riskLevel}</Badge>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-slate-500" />
                        <span className="text-xs text-slate-500">Confidence</span>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{hotspot.confidence}%</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Hotspot Details */}
        {selectedHotspot && (
          <>
            <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 mb-8 shadow-sm">
              <h3 className="text-lg font-bold mb-4 text-slate-900">Selected Hotspot Details</h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Location</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.location}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Confidence</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.confidence}%</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Risk Level</p>
                  <Badge className={getRiskColor(selectedHotspot.riskLevel)}>{selectedHotspot.riskLevel}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Coordinates</p>
                  <p className="font-semibold text-sm text-slate-900">
                    {selectedHotspot.latitude.toFixed(2)}, {selectedHotspot.longitude.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Action buttons inside the details card for immediate visibility */}
              <div className="mt-6 pt-6 border-t border-orange-200 flex gap-3 flex-wrap">
                <button
                  onClick={handleViewDetailOnMap}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm"
                  title="Focus on selected hotspot with aggressive zoom"
                >
                  <MapIcon className="w-4 h-4" />
                  View Detail on Map
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm"
                  title="Download report for selected hotspot"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
                <Link href="/upload">
                  <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-sm text-sm">
                    Upload Data Area
                  </button>
                </Link>
              </div>

              <div className="mt-6 pt-4 border-t border-orange-200">
                <p className="text-xs text-slate-500 text-center">
                  Data simulated for demonstration — powered by AI Computer Vision.
                </p>
              </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6 mb-8 animate-fade-up">
              <EnvironmentalInfo />
              <AIForecastGauge />
              <RecentAlertsLog />
            </div>

            {/* Fire Detection Trend */}
            <Card className="mb-8 p-6 bg-white border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Fire Detection Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
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
                    dataKey="fires"
                    stroke="#F44336"
                    strokeWidth={2}
                    dot={{ fill: "#FF9800", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
