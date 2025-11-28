"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Eye, EyeOff } from "lucide-react"

interface Hotspot {
  id: number
  location: string
  confidence: number
  detectionTime: string
  riskLevel: "Low" | "Medium" | "High"
  latitude: number
  longitude: number
  region: string
}

interface LeafletFireMapProps {
  hotspots: Hotspot[]
  selectedHotspot: Hotspot | null
  onHotspotSelect: (hotspot: Hotspot) => void
  zoomTrigger?: number
}

export default function LeafletFireMap({
  hotspots,
  selectedHotspot,
  onHotspotSelect,
  zoomTrigger = 0,
}: LeafletFireMapProps) {
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [map, setMap] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  // Only render on client side (fix Next.js hydration)
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Zoom to selected hotspot when zoomTrigger changes
  useEffect(() => {
    if (map && selectedHotspot && zoomTrigger > 0) {
      map.setView([selectedHotspot.latitude, selectedHotspot.longitude], 10, {
        animate: true,
        duration: 1,
      })
    }
  }, [zoomTrigger, selectedHotspot, map])

  const getRiskColor = (level: string) => {
    switch (level) {
      case "High":
        return "#ef4444"
      case "Medium":
        return "#f59e0b"
      case "Low":
        return "#10b981"
      default:
        return "#6b7280"
    }
  }

  // Only render map on client side
  if (!isClient) {
    return (
      <Card className="overflow-hidden bg-white border-slate-200 shadow-sm">
        <div className="relative w-full h-[480px] bg-slate-100 flex items-center justify-center">
          <div className="text-slate-500">Loading map...</div>
        </div>
      </Card>
    )
  }

  // Dynamic import Leaflet components (client-side only)
  const { MapContainer, TileLayer, Marker, Popup, useMap, Circle } = require("react-leaflet")
  const L = require("leaflet")

  // Fix Leaflet default marker icon issue in Next.js
  delete L.Icon.Default.prototype._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  })

  // Custom marker icons based on risk level
  const createCustomIcon = (riskLevel: string, isSelected: boolean) => {
    const color = getRiskColor(riskLevel)
    const size = isSelected ? 40 : 30

    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="
          width: ${size}px;
          height: ${size}px;
          background: ${color};
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${isSelected ? "18px" : "14px"};
          transition: all 0.3s ease;
        ">
          ${riskLevel === "High" ? "!" : "•"}
        </div>
      `,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    })
  }

  // Component to set map reference
  function MapController() {
    const map = useMap()
    useEffect(() => {
      setMap(map)
    }, [map])
    return null
  }

  return (
    <Card className="overflow-hidden bg-white border-slate-200 shadow-sm">
      <div className="relative w-full h-[480px]">
        <MapContainer
          center={[0.5, 101.5]}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
        >
          <MapController />
          
          {/* OpenStreetMap Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Hotspot Markers */}
          {hotspots.map((hotspot) => {
            const isSelected = selectedHotspot?.id === hotspot.id
            
            return (
              <div key={hotspot.id}>
                {/* Main Marker */}
                <Marker
                  position={[hotspot.latitude, hotspot.longitude]}
                  icon={createCustomIcon(hotspot.riskLevel, isSelected)}
                  eventHandlers={{
                    click: () => onHotspotSelect(hotspot),
                  }}
                >
                  <Popup>
                    <div className="p-2 min-w-[200px]">
                      <h3 className="font-bold text-sm mb-2">{hotspot.location}</h3>
                      <div className="space-y-1 text-xs">
                        <p>
                          <span className="font-semibold">Risk:</span>{" "}
                          <span style={{ color: getRiskColor(hotspot.riskLevel) }}>
                            {hotspot.riskLevel}
                          </span>
                        </p>
                        <p>
                          <span className="font-semibold">Confidence:</span> {hotspot.confidence}%
                        </p>
                        <p>
                          <span className="font-semibold">Detected:</span> {hotspot.detectionTime}
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>

                {/* Heatmap Circle (if enabled) */}
                {showHeatmap && (
                  <Circle
                    center={[hotspot.latitude, hotspot.longitude]}
                    radius={
                      hotspot.riskLevel === "High"
                        ? 50000
                        : hotspot.riskLevel === "Medium"
                          ? 30000
                          : 15000
                    }
                    pathOptions={{
                      fillColor: getRiskColor(hotspot.riskLevel),
                      fillOpacity: 0.3,
                      color: getRiskColor(hotspot.riskLevel),
                      weight: 1,
                    }}
                  />
                )}
              </div>
            )
          })}
        </MapContainer>

        {/* Controls */}
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur border border-slate-200 rounded-lg shadow-md p-2 flex gap-2">
          <button
            onClick={() => map?.zoomIn()}
            className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-700 font-bold"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={() => map?.zoomOut()}
            className="p-2 hover:bg-slate-100 rounded transition-colors text-slate-700 font-bold"
            title="Zoom out"
          >
            −
          </button>
          <div className="w-px bg-slate-200" />
          <button
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-2 rounded transition-all flex items-center gap-2 text-sm font-medium ${
              showHeatmap
                ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
            title="Toggle Risk Heatmap Overlay"
          >
            {showHeatmap ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            <span className="hidden sm:inline">Heatmap</span>
          </button>
          <button
            onClick={() => map?.setView([0.5, 101.5], 7)}
            className="px-3 py-2 hover:bg-slate-100 rounded transition-colors text-slate-700 text-sm font-medium"
            title="Reset view"
          >
            ↺
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur border border-slate-200 rounded-lg p-4 text-sm text-slate-900 shadow-md z-[1000]">
          <p className="font-semibold mb-3 text-slate-900">Risk Levels</p>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getRiskColor("High") }}
              />
              <span className="text-xs text-slate-600">High Risk</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getRiskColor("Medium") }}
              />
              <span className="text-xs text-slate-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-full border-2 border-white"
                style={{ backgroundColor: getRiskColor("Low") }}
              />
              <span className="text-xs text-slate-600">Low Risk</span>
            </div>
          </div>

          {showHeatmap && (
            <div className="mt-3 pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-2">Heatmap Intensity</p>
              <div className="h-3 rounded-full bg-gradient-to-r from-green-600 via-yellow-500 to-red-700" />
              <div className="flex justify-between text-xs text-slate-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Map Info Footer */}
      <div className="px-4 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
        <p className="text-sm text-slate-600">
          Sumatra Region • {hotspots.length} active hotspots detected • Click markers to view details
        </p>
      </div>
    </Card>
  )
}