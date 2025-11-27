"use client"

import { useEffect, useState } from "react"

interface AnimatedCounterProps {
  value: number
  duration?: number
  suffix?: string
}

export default function AnimatedCounter({ value, duration = 1000, suffix = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    let current = 0
    const increment = value / (duration / 50)
    const interval = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayValue(value)
        clearInterval(interval)
      } else {
        setDisplayValue(Math.floor(current))
      }
    }, 50)
    return () => clearInterval(interval)
  }, [value, duration])

  return (
    <span>
      {displayValue}
      {suffix}
    </span>
  )
}
