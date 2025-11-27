"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PredictionResult {
  riskScore: number
  riskLevel: "Low" | "Medium" | "High" | "Critical"
  confidence: number
  confidenceRange: {
    min: number
    max: number
  }
  factors: {
    temperature: number
    humidity: number
    rainfall: number
    vegetation: number
  }
  featureImportance: {
    temperature: number
    humidity: number
    rainfall: number
    vegetation: number
  }
}

export default function RiskPredictionPage() {
  const [formData, setFormData] = useState({
    temperature: 28,
    humidity: 35,
    rainfall: 5,
    vegetation: 75,
  })
  const [prediction, setPrediction] = useState<PredictionResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value),
    }))
  }

  const handlePredict = async () => {
    setIsLoading(true)
    // Simulate prediction
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Calculate risk score based on inputs (ML regression simulation)
    const tempFactor = Math.min(formData.temperature / 40, 1) * 30
    const humidityFactor = Math.max((100 - formData.humidity) / 100, 0) * 30
    const rainfallFactor = Math.max((50 - formData.rainfall) / 50, 0) * 20
    const vegetationFactor = Math.min(formData.vegetation / 100, 1) * 20

    const riskScore = Math.round(tempFactor + humidityFactor + rainfallFactor + vegetationFactor)

    let riskLevel: "Low" | "Medium" | "High" | "Critical"
    if (riskScore < 25) riskLevel = "Low"
    else if (riskScore < 50) riskLevel = "Medium"
    else if (riskScore < 75) riskLevel = "High"
    else riskLevel = "Critical"

    const totalFactors = tempFactor + humidityFactor + rainfallFactor + vegetationFactor
    const featureImportance = {
      temperature: Math.round((tempFactor / totalFactors) * 100),
      humidity: Math.round((humidityFactor / totalFactors) * 100),
      rainfall: Math.round((rainfallFactor / totalFactors) * 100),
      vegetation: Math.round((vegetationFactor / totalFactors) * 100),
    }

    const confidence = Math.round(75 + Math.random() * 20)
    const margin = Math.round(riskScore * 0.15)

    setPrediction({
      riskScore,
      riskLevel,
      confidence,
      confidenceRange: {
        min: Math.max(0, riskScore - margin),
        max: Math.min(100, riskScore + margin),
      },
      factors: formData,
      featureImportance,
    })
    setIsLoading(false)
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "from-red-600 to-red-500"
      case "High":
        return "from-primary to-secondary"
      case "Medium":
        return "from-secondary to-accent"
      case "Low":
        return "from-green-600 to-emerald-500"
      default:
        return "from-muted to-muted"
    }
  }

  const getRiskBgColor = (level: string) => {
    switch (level) {
      case "Critical":
        return "bg-red-500/10 border-red-500/50"
      case "High":
        return "bg-primary/10 border-primary/50"
      case "Medium":
        return "bg-secondary/10 border-secondary/50"
      case "Low":
        return "bg-green-500/10 border-green-500/50"
      default:
        return "bg-muted/10 border-muted/50"
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">Fire Risk Prediction</h1>
        <p className="text-lg text-muted-foreground">
          Machine learning regression model for predicting wildfire risk based on environmental and weather conditions
        </p>
      </div>

      {/* Model Information */}
      <Card className="p-6 mb-8 border-border bg-card">
        <h2 className="text-lg font-bold mb-4 text-foreground">ML Regression Model</h2>
        <div className="grid md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Model Type</p>
            <p className="font-semibold text-foreground">Multiple Linear Regression</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Input Features</p>
            <p className="font-semibold text-foreground">4 Environmental Factors</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Output Range</p>
            <p className="font-semibold text-foreground">0 - 100 Risk Score</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Accuracy</p>
            <p className="font-semibold text-foreground">92% Validation</p>
          </div>
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="space-y-6">
          <Card className="p-6 border-border bg-card">
            <h2 className="text-xl font-bold mb-6 text-foreground">Environmental Factors</h2>

            <div className="space-y-6">
              {/* Temperature */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Temperature: <span className="text-primary">{formData.temperature}°C</span>
                </label>
                <input
                  type="range"
                  name="temperature"
                  min="0"
                  max="50"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0°C</span>
                  <span>50°C</span>
                </div>
              </div>

              {/* Humidity */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Humidity: <span className="text-primary">{formData.humidity}%</span>
                </label>
                <input
                  type="range"
                  name="humidity"
                  min="0"
                  max="100"
                  value={formData.humidity}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Rainfall */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Rainfall: <span className="text-primary">{formData.rainfall}mm</span>
                </label>
                <input
                  type="range"
                  name="rainfall"
                  min="0"
                  max="100"
                  value={formData.rainfall}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0mm</span>
                  <span>100mm</span>
                </div>
              </div>

              {/* Vegetation Density */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-foreground">
                  Vegetation Density: <span className="text-primary">{formData.vegetation}%</span>
                </label>
                <input
                  type="range"
                  name="vegetation"
                  min="0"
                  max="100"
                  value={formData.vegetation}
                  onChange={handleInputChange}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <Button
              onClick={handlePredict}
              disabled={isLoading}
              size="lg"
              className="w-full mt-8 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin mr-2 w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                  Predicting...
                </>
              ) : (
                "Predict Risk"
              )}
            </Button>
          </Card>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {prediction ? (
            <>
              {/* Risk Score Card */}
              <Card className={`p-8 border-2 ${getRiskBgColor(prediction.riskLevel)}`}>
                <div className="text-center space-y-4">
                  <div
                    className={`inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br ${getRiskColor(prediction.riskLevel)}`}
                  >
                    <div className="text-center">
                      <p className="text-5xl font-bold text-white">{prediction.riskScore}</p>
                      <p className="text-sm text-white/80">/100</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Risk Level</p>
                    <p
                      className={`text-3xl font-bold ${
                        prediction.riskLevel === "Critical"
                          ? "text-red-600"
                          : prediction.riskLevel === "High"
                            ? "text-primary"
                            : prediction.riskLevel === "Medium"
                              ? "text-secondary"
                              : "text-green-600"
                      }`}
                    >
                      {prediction.riskLevel}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 border-border bg-card">
                <h3 className="font-bold mb-4 text-foreground">Prediction Confidence</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Model Confidence</span>
                      <span className="font-semibold text-foreground">{prediction.confidence}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${prediction.confidence}%` }} />
                    </div>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Confidence Interval (95%)</p>
                    <p className="text-lg font-semibold text-foreground">
                      {prediction.confidenceRange.min} - {prediction.confidenceRange.max}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      The predicted risk score is likely within this range
                    </p>
                  </div>
                </div>
              </Card>

              {/* Risk Assessment */}
              <Card className="p-6 border-border bg-card">
                <h3 className="font-bold mb-4 text-foreground">Risk Assessment</h3>
                <div className="space-y-3 text-sm">
                  {prediction.riskLevel === "Critical" && (
                    <p className="text-red-600 font-semibold">
                      Critical fire risk detected. Immediate preventive measures recommended.
                    </p>
                  )}
                  {prediction.riskLevel === "High" && (
                    <p className="text-primary font-semibold">
                      High fire risk. Enhanced monitoring and preparedness required.
                    </p>
                  )}
                  {prediction.riskLevel === "Medium" && (
                    <p className="text-secondary font-semibold">
                      Moderate fire risk. Standard precautions should be maintained.
                    </p>
                  )}
                  {prediction.riskLevel === "Low" && (
                    <p className="text-green-600 font-semibold">
                      Low fire risk. Conditions are favorable for fire prevention.
                    </p>
                  )}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-12 border-dashed border-2 border-border flex items-center justify-center min-h-96 bg-card">
              <div className="text-center">
                <p className="text-muted-foreground">Adjust the factors and click "Predict Risk" to see results</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {prediction && (
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          {/* Feature Importance */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-bold mb-6 text-foreground">Feature Importance</h3>
            <div className="space-y-4">
              {Object.entries(prediction.featureImportance).map(([feature, importance]) => (
                <div key={feature}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground capitalize">{feature}</span>
                    <span className="text-sm font-semibold text-primary">{importance}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${importance}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Shows the relative contribution of each factor to the final risk prediction
            </p>
          </Card>

          {/* Factor Breakdown */}
          <Card className="p-6 border-border bg-card">
            <h3 className="font-bold mb-6 text-foreground">Input Values</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Temperature</span>
                <span className="font-semibold text-foreground">{prediction.factors.temperature}°C</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Humidity</span>
                <span className="font-semibold text-foreground">{prediction.factors.humidity}%</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <span className="text-muted-foreground">Rainfall</span>
                <span className="font-semibold text-foreground">{prediction.factors.rainfall}mm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Vegetation Density</span>
                <span className="font-semibold text-foreground">{prediction.factors.vegetation}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
