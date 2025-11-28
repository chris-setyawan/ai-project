import { useState, useEffect, useCallback } from "react"

// Detection result interface
export interface DetectionResult {
  fireDetected: boolean
  confidence: number
  detectedObjects: string[]
  affectedArea: string
  processingTime: string
  imageQuality: string
  lightingConditions: string
  recommendations: string[]
  detectionType: "Fire" | "Smoke" | "No Fire"
  boundingBoxes?: Array<{
    class: string
    score: number
    bbox: [number, number, number, number]
  }>
}

export function useFireDetection() {
  const [model, setModel] = useState<any>(null)
  const [isModelLoading, setIsModelLoading] = useState(true)
  const [isDetecting, setIsDetecting] = useState(false)

  // Load TensorFlow model on mount
  useEffect(() => {
    loadModel()
  }, [])

  const loadModel = async () => {
    try {
      setIsModelLoading(true)
      
      // Dynamically import TensorFlow (client-side only)
      const cocoSsd = await import("@tensorflow-models/coco-ssd")
      const tf = await import("@tensorflow/tfjs")
      
      // Set backend to webgl for better performance
      await tf.setBackend("webgl")
      await tf.ready()
      
      // Load COCO-SSD model
      const loadedModel = await cocoSsd.load()
      
      setModel(loadedModel)
      setIsModelLoading(false)
      
      console.log("✅ AI Model loaded successfully")
    } catch (error) {
      console.error("❌ Error loading model:", error)
      setIsModelLoading(false)
    }
  }

  // Merge adjacent regions into larger bounding boxes
  const mergeAdjacentRegions = (
  regions: Array<{x: number, y: number, width: number, height: number, gridX: number, gridY: number}>,
  gridSize: number,
  cellPixelWidth: number,
  cellPixelHeight: number
): Array<{x: number, y: number, width: number, height: number}> => {
  if (regions.length === 0) return []

  console.log("🟢 NEW MERGE FUNCTION RUNNING")
  
  // Simply calculate bounding box from all regions (min/max approach)
  let minX = Infinity, minY = Infinity
  let maxX = -Infinity, maxY = -Infinity
  
  regions.forEach(r => {
    minX = Math.min(minX, r.x)
    minY = Math.min(minY, r.y)
    maxX = Math.max(maxX, r.x + r.width)
    maxY = Math.max(maxY, r.y + r.height)
  })

  console.log("🟢 Merged box:", { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY })
  
  return [{
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }]
}

  // Analyze image colors for fire/smoke detection
  const analyzeImageColors = (imageElement: HTMLImageElement): {
    hasFireColors: boolean
    hasSmokeColors: boolean
    fireScore: number
    smokeScore: number
    fireRegions: Array<{x: number, y: number, width: number, height: number}>
    smokeRegions: Array<{x: number, y: number, width: number, height: number}>
  } => {
    // Create canvas to analyze pixels
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    
    if (!ctx) {
      return { hasFireColors: false, hasSmokeColors: false, fireScore: 0, smokeScore: 0, fireRegions: [], smokeRegions: [] }
    }

    // Resize for processing
    const maxSize = 600
    const scale = Math.min(1, maxSize / Math.max(imageElement.width, imageElement.height))
    canvas.width = imageElement.width * scale
    canvas.height = imageElement.height * scale
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    let firePixels = 0
    let smokePixels = 0
    let totalPixels = pixels.length / 4
    
    // Grid-based region detection - 10x10 for good balance
    const gridSize = 10
    const cellWidth = canvas.width / gridSize
    const cellHeight = canvas.height / gridSize
    const gridFireCount: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))
    const gridSmokeCount: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))
    const gridTotalCount: number[][] = Array(gridSize).fill(0).map(() => Array(gridSize).fill(0))

    // First pass: calculate average brightness to detect sky/background
    let totalBrightness = 0
    for (let i = 0; i < pixels.length; i += 4) {
      totalBrightness += (pixels[i] + pixels[i + 1] + pixels[i + 2]) / 3
    }
    const avgBrightness = totalBrightness / totalPixels

    // Analyze each pixel
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i]
      const g = pixels[i + 1]
      const b = pixels[i + 2]
      
      const pixelIndex = i / 4
      const x = pixelIndex % canvas.width
      const y = Math.floor(pixelIndex / canvas.width)
      const gridX = Math.min(Math.floor(x / cellWidth), gridSize - 1)
      const gridY = Math.min(Math.floor(y / cellHeight), gridSize - 1)
      
      gridTotalCount[gridY][gridX]++

      const brightness = (r + g + b) / 3
      const colorDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b))

      // Fire detection (red/orange/yellow colors)
      const isReddish = r > 150 && r > g * 1.3 && r > b * 1.5
      const isOrangish = r > 180 && g > 80 && g < 180 && b < 100
      const isYellowish = r > 200 && g > 150 && b < 100
      const isBrightFire = r > 220 && g > 100 && g < 200 && b < 80
      
      if (isReddish || isOrangish || isYellowish || isBrightFire) {
        firePixels++
        gridFireCount[gridY][gridX]++
      }

      // Smoke detection - improved to detect various smoke colors
      // Exclude very bright pixels (likely sky) and very dark pixels
      const isNotSky = brightness < 240 && !(brightness > 200 && b > r && b > g)
      const isNotTooLight = brightness < 250
      const isNotTooDark = brightness > 80
      
      // Smoke is typically gray/white with low color variation
      const isGraySmoke = brightness > 120 && brightness < 220 && colorDiff < 40 && isNotSky
      const isWhiteSmoke = brightness > 180 && brightness < 245 && colorDiff < 50 && isNotSky
      const isDenseSmoke = brightness > 100 && brightness < 180 && colorDiff < 35
      
      // Also detect bluish-gray smoke (common in forest fires)
      const isBluishSmoke = brightness > 130 && brightness < 200 && b >= r - 20 && b >= g - 20 && colorDiff < 45
      
      if ((isGraySmoke || isWhiteSmoke || isDenseSmoke || isBluishSmoke) && isNotTooLight && isNotTooDark) {
        smokePixels++
        gridSmokeCount[gridY][gridX]++
      }
    }

    // Calculate pixel dimensions for bounding boxes
    const cellPixelWidth = Math.round(imageElement.width / gridSize)
    const cellPixelHeight = Math.round(imageElement.height / gridSize)

    // Find regions with fire/smoke concentration
    const fireRegionsRaw: Array<{x: number, y: number, width: number, height: number, gridX: number, gridY: number}> = []
    const smokeRegionsRaw: Array<{x: number, y: number, width: number, height: number, gridX: number, gridY: number}> = []
    
    for (let gy = 0; gy < gridSize; gy++) {
      for (let gx = 0; gx < gridSize; gx++) {
        const cellTotal = gridTotalCount[gy][gx]
        if (cellTotal === 0) continue
        
        const fireRatio = gridFireCount[gy][gx] / cellTotal
        const smokeRatio = gridSmokeCount[gy][gx] / cellTotal
        
        // Lower thresholds: 10% for fire, 8% for smoke
        if (fireRatio > 0.15) {
          fireRegionsRaw.push({
            x: gx * cellPixelWidth,
            y: gy * cellPixelHeight,
            width: cellPixelWidth,
            height: cellPixelHeight,
            gridX: gx,
            gridY: gy
          })
        }
        if (smokeRatio > 0.20) {
          smokeRegionsRaw.push({
            x: gx * cellPixelWidth,
            y: gy * cellPixelHeight,
            width: cellPixelWidth,
            height: cellPixelHeight,
            gridX: gx,
            gridY: gy
          })
        }
      }
    }

    // Debug: log raw regions before merging
    console.log("🔍 Raw regions before merge:", {
      fireRegionsRaw: fireRegionsRaw.length,
      smokeRegionsRaw: smokeRegionsRaw.length,
      smokePositions: smokeRegionsRaw.map(r => `(${r.gridX},${r.gridY})`)
    })

    // Merge adjacent regions for cleaner bounding boxes
    const fireRegions = mergeAdjacentRegions(fireRegionsRaw, gridSize, cellPixelWidth, cellPixelHeight)
    const smokeRegions = mergeAdjacentRegions(smokeRegionsRaw, gridSize, cellPixelWidth, cellPixelHeight)

    const firePercentage = (firePixels / totalPixels) * 100
    const smokePercentage = (smokePixels / totalPixels) * 100

    return {
      hasFireColors: firePercentage > 1.5,
      hasSmokeColors: smokePercentage > 2,  // Lowered from 3%
      fireScore: Math.min(firePercentage * 10, 100),
      smokeScore: Math.min(smokePercentage * 5, 100),
      fireRegions,
      smokeRegions
    }
  }

  const detectFire = useCallback(
    async (imageElement: HTMLImageElement): Promise<DetectionResult> => {
      if (!model) {
        throw new Error("Model not loaded yet")
      }

      setIsDetecting(true)
      const startTime = performance.now()

      try {
        // Run color analysis
        const colorAnalysis = analyzeImageColors(imageElement)

        // DEBUG: Log color analysis results
        console.log("🔍 Color Analysis Results:", {
          hasFireColors: colorAnalysis.hasFireColors,
          hasSmokeColors: colorAnalysis.hasSmokeColors,
          fireScore: colorAnalysis.fireScore,
          smokeScore: colorAnalysis.smokeScore,
          fireRegions: colorAnalysis.fireRegions.length,
          smokeRegions: colorAnalysis.smokeRegions.length
        })

        // Run object detection for additional context
        const predictions = await model.detect(imageElement)
        
        const endTime = performance.now()
        const processingTime = `${Math.round(endTime - startTime)}ms`

        // Determine detection type and confidence
        let detectionType: "Fire" | "Smoke" | "No Fire" = "No Fire"
        let fireDetected = false
        let confidence = 0
        let detectedObjects: string[] = []
        let boundingBoxes: Array<{class: string, score: number, bbox: [number, number, number, number]}> = []

        if (colorAnalysis.hasFireColors && colorAnalysis.fireScore > 25) {
          // Fire detection
          detectionType = "Fire"
          fireDetected = true
          confidence = Math.min(Math.round(colorAnalysis.fireScore), 95)
          detectedObjects = ["Fire", "Flames"]
          
          boundingBoxes = colorAnalysis.fireRegions.slice(0, 5).map((region) => ({
            class: "Fire",
            score: Math.round(colorAnalysis.fireScore),
            bbox: [region.x, region.y, region.width, region.height] as [number, number, number, number]
          }))
          
        } else if (colorAnalysis.hasSmokeColors && colorAnalysis.smokeScore > 10) {
          // Smoke detection
          detectionType = "Smoke"
          fireDetected = true
          confidence = Math.min(Math.round(colorAnalysis.smokeScore), 90)
          detectedObjects = ["Smoke"]
          
          boundingBoxes = colorAnalysis.smokeRegions.slice(0, 5).map((region) => ({
            class: "Smoke",
            score: Math.round(colorAnalysis.smokeScore),
            bbox: [region.x, region.y, region.width, region.height] as [number, number, number, number]
          }))
          
        } else {
          detectionType = "No Fire"
          confidence = Math.max(60, 100 - Math.round(Math.max(colorAnalysis.fireScore, colorAnalysis.smokeScore)))
          detectedObjects = []
        }

        // Calculate affected area
        const affectedArea = fireDetected
          ? `${Math.round(boundingBoxes.reduce((sum, box) => {
              return sum + (box.bbox[2] * box.bbox[3]) / (imageElement.width * imageElement.height) * 100
            }, 0))}% of image`
          : "0%"

        // Determine image quality
        const imageQuality = imageElement.width > 1000 ? "Excellent" : 
                            imageElement.width > 600 ? "Good" : "Fair"

        // Determine lighting
        const lightingConditions = "Analyzed"

        // Generate recommendations
        const recommendations = fireDetected
          ? detectionType === "Fire"
            ? [
                `🔥 Fire detected with ${confidence}% confidence`,
                "⚠️ Immediate action required - verify and alert authorities",
                "📞 Contact emergency services (911) if confirmed",
                "🚨 Evacuate area and ensure safety of personnel",
                "📍 Document location and monitor fire spread"
              ]
            : [
                `💨 Smoke detected with ${confidence}% confidence`,
                "⚠️ Potential fire hazard - investigate source immediately",
                "🔍 Check for hidden fires or smoldering materials",
                "📞 Contact fire department if smoke persists",
                "👥 Ensure area is evacuated if smoke intensifies"
              ]
          : [
              "✅ No fire or smoke detected in image",
              "🔍 Image analysis complete - area appears safe",
              `📊 Confidence: ${confidence}%`,
              "🔄 Continue monitoring with regular scans",
              "📸 Upload another image to continue surveillance"
            ]

        setIsDetecting(false)

        return {
          fireDetected,
          confidence,
          detectedObjects,
          affectedArea,
          processingTime,
          imageQuality,
          lightingConditions,
          recommendations,
          detectionType,
          boundingBoxes,
        }
      } catch (error) {
        console.error("Detection error:", error)
        setIsDetecting(false)
        throw error
      }
    },
    [model]
  )

  return {
    detectFire,
    isModelLoading,
    isDetecting,
    modelReady: !!model,
  }
}