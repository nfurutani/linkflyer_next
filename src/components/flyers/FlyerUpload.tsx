'use client'

import { useState, useRef } from 'react'
import { useImageAnalysis } from '@/hooks/useImageAnalysis'
import { createClientSupabaseClient } from '@/lib/supabase/client'

interface FlyerUploadProps {
  userId: string
  onSuccess?: () => void
  onCancel?: () => void
}

interface FlyerData {
  title: string
  description: string
  eventDate: string
  venueName: string
  venueAddress: string
  addressComponents?: any[]
  country: string
  administrativeAreaLevel1: string
  locality: string
  confidence: number
  geocodeLat?: number | null
  geocodeLng?: number | null
}

export function FlyerUpload({ userId, onSuccess, onCancel }: FlyerUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [currentStep, setCurrentStep] = useState<'upload' | 'analyzing' | 'venue-lookup' | 'edit' | 'save'>('upload')
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  const { analyzeImage, isAnalyzing, error: analysisError } = useImageAnalysis()

  const [flyerData, setFlyerData] = useState<FlyerData>({
    title: '',
    description: '',
    eventDate: '',
    venueName: '',
    venueAddress: '',
    addressComponents: [],
    country: '',
    administrativeAreaLevel1: '',
    locality: '',
    confidence: 0
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be smaller than 10MB')
      return
    }

    setSelectedFile(file)
    setError('')

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setCurrentStep('analyzing')
    setError('')

    try {
      // Step 1: Analyzing with both Gemini and Google Maps
      const result = await analyzeImage(selectedFile)

      console.log('Analysis result in FlyerUpload:', result)

      if (result) {
        const newFlyerData = {
          title: result.title || '',
          description: result.description || '',
          eventDate: result.eventDate || '',
          venueName: result.venueName || '',
          venueAddress: result.venueAddress || '',
          confidence: result.confidence || 0,
          geocodeLat: result.geocodeLat,
          geocodeLng: result.geocodeLng,
          addressComponents: result.addressComponents || [],
          country: result.country || '',
          administrativeAreaLevel1: result.administrativeAreaLevel1 || '',
          locality: result.locality || ''
        }
        
        setFlyerData(newFlyerData)
        setCurrentStep('edit')
      } else {
        setError(analysisError || 'Failed to analyze image')
        setCurrentStep('upload')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setCurrentStep('upload')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFlyerData(prev => ({ ...prev, [name]: value }))
  }

  const uploadImageToStorage = async (file: File): Promise<string> => {
    const supabase = createClientSupabaseClient()
    
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('flyer-images')
      .upload(fileName, file)

    if (error) {
      throw new Error(`Upload failed: ${error.message}`)
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('flyer-images')  
      .getPublicUrl(data.path)

    return publicUrl
  }

  const saveFlyer = async () => {
    if (!userId || !selectedFile) return

    setIsSaving(true)
    setError('')

    try {
      // Upload image to Supabase Storage
      const imageUrl = await uploadImageToStorage(selectedFile)

      // Save flyer data to database
      const supabase = createClientSupabaseClient()
      const { error: dbError } = await supabase
        .from('flyers')
        .insert({
          user_id: userId,
          image_url: imageUrl,
          title: flyerData.title || null,
          description: flyerData.description || null,
          event_date: flyerData.eventDate || null,
          venue_name: flyerData.venueName || null,
          venue_address: flyerData.venueAddress || null,
          address_components: flyerData.addressComponents || null,
          geocode_lat: flyerData.geocodeLat || null,
          geocode_lng: flyerData.geocodeLng || null,
          active: true
        })

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`)
      }

      setCurrentStep('save')
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1500)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save flyer')
    } finally {
      setIsSaving(false)
    }
  }

  const resetUpload = () => {
    setSelectedFile(null)
    setImagePreview('')
    setCurrentStep('upload')
    setFlyerData({
      title: '',
      description: '',
      eventDate: '',
      venueName: '',
      venueAddress: '',
      confidence: 0,
      addressComponents: [],
      country: '',
      administrativeAreaLevel1: '',
      locality: ''
    })
    setError('')
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload Step
  if (currentStep === 'upload') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Upload Event Flyer</h2>
          <p className="text-gray-600">AI will analyze your flyer and extract event details</p>
        </div>

        {/* File Upload Area */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 transition-colors"
        >
          {imagePreview ? (
            <div className="space-y-4">
              <img
                src={imagePreview}
                alt="Preview"
                className="max-h-64 mx-auto rounded-lg"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  resetUpload()
                }}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Remove image
              </button>
            </div>
          ) : (
            <div>
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="mt-4">
                <p className="text-lg font-medium text-gray-900">Choose an image</p>
                <p className="text-sm text-gray-500">or drag and drop here</p>
              </div>
              <p className="text-xs text-gray-400 mt-2">PNG, JPG up to 10MB</p>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {onCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleAnalyze}
            disabled={!selectedFile}
            className="flex-1 py-3 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze with AI
          </button>
        </div>
      </div>
    )
  }

  // Analyzing Step
  if (currentStep === 'analyzing') {
    return (
      <div className="text-center space-y-6">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto"></div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Flyer</h2>
          <p className="text-gray-600">AI is extracting event information and venue details...</p>
          <div className="mt-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Step 1: Reading flyer content with Gemini AI</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
              <span>Step 2: Looking up venue information with Google Maps</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Edit Step
  if (currentStep === 'edit') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Edit Details</h2>
          <p className="text-gray-600">
            AI Confidence: <span className={`font-medium ${flyerData.confidence > 0.7 ? 'text-green-600' : flyerData.confidence > 0.4 ? 'text-yellow-600' : 'text-red-600'}`}>
              {Math.round(flyerData.confidence * 100)}%
            </span>
          </p>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="flex justify-center">
            <img
              src={imagePreview}
              alt="Flyer"
              className="max-h-32 rounded-lg"
            />
          </div>
        )}

        {/* Edit Form */}
        <div className="space-y-6">
          {/* Gemini Results Section */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">📅 Event Information (from AI)</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={flyerData.eventDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                />
              </div>
            </div>
          </div>

          {/* Google Maps Results Section */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-green-900 mb-3">📍 Location Information (from Google Maps)</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="venueName" className="block text-sm font-medium text-gray-700 mb-1">
                  Venue Name
                </label>
                <input
                  id="venueName"
                  name="venueName"
                  type="text"
                  value={flyerData.venueName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Enter venue name"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country
                </label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={flyerData.country}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Country"
                />
              </div>

              <div>
                <label htmlFor="administrativeAreaLevel1" className="block text-sm font-medium text-gray-700 mb-1">
                  Prefecture/State
                </label>
                <input
                  id="administrativeAreaLevel1"
                  name="administrativeAreaLevel1"
                  type="text"
                  value={flyerData.administrativeAreaLevel1}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="Prefecture or State"
                />
              </div>

              <div>
                <label htmlFor="locality" className="block text-sm font-medium text-gray-700 mb-1">
                  City/Locality
                </label>
                <input
                  id="locality"
                  name="locality"
                  type="text"
                  value={flyerData.locality}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900"
                  placeholder="City or Locality"
                />
              </div>

            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => setCurrentStep('upload')}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50"
          >
            Back
          </button>
          <button
            onClick={saveFlyer}
            disabled={isSaving}
            className="flex-1 py-3 px-4 bg-purple-600 text-white font-medium rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Flyer'}
          </button>
        </div>
      </div>
    )
  }

  // Success Step
  if (currentStep === 'save') {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Flyer Uploaded Successfully!</h2>
          <p className="text-gray-600">Your event flyer is now live on your profile</p>
        </div>
      </div>
    )
  }

  return null
}