"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Globe, Clock, AlertTriangle, Flame, Download, MapIcon, Upload, X } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { toast } from "sonner"
import AnimatedCounter from "@/components/animated-counter"
import EnvironmentalInfo from "@/components/environmental-info"
import AIForecastGauge from "@/components/ai-forecast-gauge"
import RecentAlertsLog from "@/components/recent-alerts-log"
import LeafletFireMap from "@/components/leaflet-fire-map"
import { useFireDetection } from "@/hooks/use-fire-detection"

interface Hotspot {
  id: number
  location: string
  confidence: number
  detectionTime: string
  riskLevel: "Low" | "Medium" | "High"
  latitude: number
  longitude: number
  region: "Sumatra"
  detectionType?: "Fire" | "Smoke" | "No Fire"
}

const initialHotspots: Hotspot[] = [
  {
    id: 1,
    location: "Riau Province, Sumatra",
    confidence: 94,
    detectionTime: "2 hours ago",
    riskLevel: "High",
    latitude: 0.5,
    longitude: 101.0,
    region: "Sumatra",
    detectionType: "Fire",
  },
  {
    id: 2,
    location: "Jambi Province, Sumatra",
    confidence: 76,
    detectionTime: "6 hours ago",
    riskLevel: "Medium",
    latitude: -1.5,
    longitude: 103.0,
    region: "Sumatra",
    detectionType: "Smoke",
  },
  {
    id: 3,
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

// Generate random coordinate near Sumatra
function getRandomSumatraCoord() {
  const baseLat = 0.5 + (Math.random() - 0.5) * 4
  const baseLng = 101.0 + (Math.random() - 0.5) * 4
  return { lat: baseLat, lng: baseLng }
}

export default function DashboardPage() {
  const [hotspots, setHotspots] = useState<Hotspot[]>(initialHotspots)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(initialHotspots[0])
  const [mapZoomTrigger, setMapZoomTrigger] = useState<number>(0)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null)
  const [locationInput, setLocationInput] = useState("")
  const [coordInput, setCoordInput] = useState({ lat: "", lng: "" })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  
  const { detectFire, isModelLoading, isDetecting } = useFireDetection()
  
  const filteredHotspots = hotspots
  const highRiskCount = hotspots.filter((h) => h.riskLevel === "High").length

  const handleViewDetailOnMap = () => {
    if (selectedHotspot) {
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
    const reportFilename = `iFire_Report_${locationName}_${dateStr}.txt`

    const reportContent = `
================================================================================
                        iFIRE FIRE DETECTION REPORT
================================================================================

Report Generated: ${today.toLocaleString()}

SELECTED HOTSPOT DETAILS
------------------------
Location: ${selectedHotspot.location}
Detection Type: ${selectedHotspot.detectionType || "Unknown"}
Risk Level: ${selectedHotspot.riskLevel}
Confidence: ${selectedHotspot.confidence}%
Detection Time: ${selectedHotspot.detectionTime}
Coordinates: ${selectedHotspot.latitude.toFixed(2)}, ${selectedHotspot.longitude.toFixed(2)}

SUMMARY STATISTICS
------------------
Total Detections: ${hotspots.length}
High Risk Areas: ${hotspots.filter((h) => h.riskLevel === "High").length}
Medium Risk Areas: ${hotspots.filter((h) => h.riskLevel === "Medium").length}
Low Risk Areas: ${hotspots.filter((h) => h.riskLevel === "Low").length}

ALL HOTSPOTS
------------
${hotspots.map((h) => `• ${h.location} - ${h.detectionType || "N/A"} - Risk: ${h.riskLevel} (${h.confidence}%)`).join("\n")}

================================================================================
Powered by iFire AI Detection System
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

      toast.success("Report Downloaded", {
        description: `Report for ${locationName} downloaded successfully.`,
      })
    } catch (error) {
      toast.error("Download Failed", {
        description: "Unable to download the report. Please try again.",
      })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid File", {
          description: "Please upload an image file",
        })
        return
      }

      const reader = new FileReader()
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string
        setUploadedImage(imageUrl)

        const img = new Image()
        img.onload = () => setImageElement(img)
        img.src = imageUrl
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRunDetection = async () => {
    if (!imageElement) {
      toast.error("No Image", { description: "Please upload an image first" })
      return
    }

    if (!locationInput.trim()) {
      toast.error("Location Required", { description: "Please enter a location name" })
      return
    }

    try {
      const result = await detectFire(imageElement)
      
      // Use user input coordinates or generate random if not provided
      let finalLat, finalLng
      if (coordInput.lat && coordInput.lng) {
        finalLat = parseFloat(coordInput.lat)
        finalLng = parseFloat(coordInput.lng)
      } else {
        const coord = getRandomSumatraCoord()
        finalLat = coord.lat
        finalLng = coord.lng
      }
      
      // Create new hotspot from detection with user input
      const newHotspot: Hotspot = {
        id: Date.now(),
        location: locationInput.trim(),
        confidence: result.confidence,
        detectionTime: "Just now",
        riskLevel: result.detectionType === "Fire" ? "High" : result.detectionType === "Smoke" ? "Medium" : "Low",
        latitude: finalLat,
        longitude: finalLng,
        region: "Sumatra",
        detectionType: result.detectionType,
      }

      setHotspots((prev) => [newHotspot, ...prev])
      setSelectedHotspot(newHotspot)
      setShowUploadModal(false)
      setUploadedImage(null)
      setImageElement(null)
      setLocationInput("")
      setCoordInput({ lat: "", lng: "" })

      toast.success("Hotspot Added!", {
        description: `${result.detectionType} detected at ${locationInput} with ${result.confidence}% confidence`,
      })

      // Auto zoom to new marker
      setTimeout(() => {
        setMapZoomTrigger((prev) => prev + 1)
      }, 500)
    } catch (error) {
      toast.error("Detection Failed", {
        description: "An error occurred. Please try again.",
      })
    }
  }

  const handleCloseModal = () => {
    setShowUploadModal(false)
    setUploadedImage(null)
    setImageElement(null)
    setLocationInput("")
    setCoordInput({ lat: "", lng: "" })
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Globe className="w-8 h-8 text-orange-500" />
              <h1 className="text-4xl font-bold text-slate-900">Fire Hotspots Dashboard</h1>
            </div>
            <Button
              onClick={() => setShowUploadModal(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Add New Hotspot
            </Button>
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
                  <AnimatedCounter value={hotspots.length} />
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
            <LeafletFireMap
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
                          {hotspot.detectionType && (
                            <p className="text-xs text-orange-600 font-medium mt-1">
                              {hotspot.detectionType === "Fire" ? "🔥" : "💨"} {hotspot.detectionType}
                            </p>
                          )}
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
                  <p className="text-sm text-slate-600 mb-1">Type</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.detectionType || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Risk Level</p>
                  <Badge className={getRiskColor(selectedHotspot.riskLevel)}>{selectedHotspot.riskLevel}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Confidence</p>
                  <p className="font-semibold text-slate-900">{selectedHotspot.confidence}%</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-orange-200 flex gap-3 flex-wrap">
                <button
                  onClick={handleViewDetailOnMap}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm"
                >
                  <MapIcon className="w-4 h-4" />
                  View on Map
                </button>
                <button
                  onClick={handleDownloadReport}
                  className="px-6 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </Card>

            <div className="grid lg:grid-cols-3 gap-6 mb-8 animate-fade-up">
              <EnvironmentalInfo />
              <AIForecastGauge />
              <RecentAlertsLog />
            </div>

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

      {/* Upload Modal - FIXED Z-INDEX */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm">
          <Card className="max-w-lg w-full p-6 bg-white max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">Add New Hotspot</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isModelLoading && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">⏳ Loading AI model... Please wait.</p>
              </div>
            )}

            <div className="space-y-4">
              {/* Location Input */}
              <div>
                <label className="block text-sm font-semibold mb-2">Location Name *</label>
                <input
                  type="text"
                  placeholder="e.g., Riau Province, Sumatra"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                <p className="text-xs text-slate-500 mt-1">Enter the location where this image was taken</p>
              </div>

              {/* Coordinates Input */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold mb-2">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="0.5"
                    value={coordInput.lat}
                    onChange={(e) => setCoordInput({ ...coordInput, lat: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="101.0"
                    value={coordInput.lng}
                    onChange={(e) => setCoordInput({ ...coordInput, lng: e.target.value })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                📍 Optional: Enter exact coordinates. Leave empty for approximate location.
              </p>

              {/* Image Upload */}
              {uploadedImage ? (
                <div className="relative w-full h-48 border-2 border-dashed rounded-lg overflow-hidden">
                  <img src={uploadedImage} alt="Upload" className="w-full h-full object-contain" />
                  <button
                    onClick={() => {
                      setUploadedImage(null)
                      setImageElement(null)
                    }}
                    className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-lg hover:bg-slate-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 border-2 border-dashed border-slate-300 rounded-lg hover:border-orange-500 transition-colors flex flex-col items-center justify-center gap-2"
                >
                  <Upload className="w-8 h-8 text-slate-400" />
                  <p className="text-sm text-slate-600">Click to upload image</p>
                  <p className="text-xs text-slate-400">PNG, JPG up to 10MB</p>
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              {/* Submit Button */}
              {uploadedImage && (
                <Button
                  onClick={handleRunDetection}
                  disabled={isDetecting || !locationInput.trim()}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {isDetecting ? (
                    <>
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      Detecting...
                    </>
                  ) : (
                    "Run Detection & Add to Map"
                  )}
                </Button>
              )}

              {uploadedImage && !locationInput.trim() && (
                <p className="text-sm text-red-600">⚠️ Please enter a location name</p>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}