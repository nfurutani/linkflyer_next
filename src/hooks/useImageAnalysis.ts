'use client'

import { useState } from 'react'

export interface ExtractedEventData {
  isEventFlyer: boolean
  title: string
  description: string
  eventDate: string
  venueName: string
  venueAddress: string
  addressComponents: any[]
  country: string
  administrativeAreaLevel1: string
  locality: string
  confidence: number
  geocodeLat?: number | null
  geocodeLng?: number | null
  rawData?: {
    gemini?: any
    gmap?: any
  }
}

export interface ImageAnalysisResponse {
  success: boolean
  data?: ExtractedEventData
  error?: string
  details?: string
}

export function useImageAnalysis() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeImage = async (imageFile: File): Promise<ExtractedEventData | null> => {
    setIsAnalyzing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to analyze image')
      }

      const result: ImageAnalysisResponse = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Analysis failed')
      }

      return result.data || null
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Image analysis error:', err)
      return null
    } finally {
      setIsAnalyzing(false)
    }
  }

  return {
    analyzeImage,
    isAnalyzing,
    error
  }
}