import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Get the form data with the image
    const formData = await request.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      return NextResponse.json(
        { error: 'No image file provided' },
        { status: 400 }
      )
    }

    // Create a new FormData for the Python API
    const apiFormData = new FormData()
    apiFormData.append('file', imageFile)

    // Forward the request to the Python FastAPI server
    const apiResponse = await fetch('http://localhost:8000/analyze-flyer', {
      method: 'POST',
      body: apiFormData,
    })

    if (!apiResponse.ok) {
      const error = await apiResponse.text()
      console.error('Python API error:', error)
      return NextResponse.json(
        { error: 'Failed to analyze image', details: error },
        { status: apiResponse.status }
      )
    }

    const apiResult = await apiResponse.json()
    
    // Transform the response to match the expected format
    const transformedResult = {
      success: apiResult.analysis_status === 'success',
      data: {
        isEventFlyer: apiResult.is_event_flyer,
        title: apiResult.event_title || '',
        description: '', // Not provided by current API
        eventDate: apiResult.event_date || '',
        venueName: apiResult.event_venue || '',
        venueAddress: apiResult.event_address || '',
        addressComponents: apiResult.address_components || [],
        country: apiResult.country || '',
        administrativeAreaLevel1: apiResult.administrative_area_level_1 || '',
        locality: apiResult.locality || '',
        confidence: apiResult.confidence || 0,
        geocodeLat: apiResult.event_geocode?.[0] || null,
        geocodeLng: apiResult.event_geocode?.[1] || null,
        rawData: {
          gemini: apiResult.raw_gemini_data,
          gmap: apiResult.raw_gmap_data
        }
      },
      error: apiResult.analysis_status !== 'success' ? apiResult.analysis_status : null
    }

    return NextResponse.json(transformedResult)
  } catch (error) {
    console.error('API route error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}