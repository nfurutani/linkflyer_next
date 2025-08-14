from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import tempfile
import sys
from typing import Optional, List, Dict, Any
import uuid

# Import existing clients
from gemini_client import analyze_event_flyer
from gmap_client import get_place_details_english, search_venues_by_name

app = FastAPI(title="Flyer Analysis API", version="1.0.0")

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Next.js development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FlyerAnalysisResponse(BaseModel):
    analysis_id: str
    is_event_flyer: bool
    event_title: Optional[str] = None
    event_date: Optional[str] = None
    event_venue: Optional[str] = None
    event_address: Optional[str] = None
    address_components: Optional[List[Dict[str, Any]]] = None
    country: Optional[str] = None
    administrative_area_level_1: Optional[str] = None
    locality: Optional[str] = None
    event_geocode: Optional[List[float]] = None
    analysis_status: str
    confidence: Optional[float] = None
    raw_gemini_data: Optional[Dict[str, Any]] = None
    raw_gmap_data: Optional[Dict[str, Any]] = None

class VenueSearchResponse(BaseModel):
    venues: List[Dict[str, Any]]
    search_status: str
    error_message: Optional[str] = None

@app.post("/analyze-flyer", response_model=FlyerAnalysisResponse)
async def analyze_flyer(file: UploadFile = File(...)):
    """
    Analyze flyer image to extract event information using Gemini AI,
    then get venue details using Google Maps API.
    """
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    analysis_id = str(uuid.uuid4())
    
    try:
        # Save to temporary file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as temp_file:
            content = await file.read()
            temp_file.write(content)
            temp_path = temp_file.name
        
        # Step 1: Gemini analysis
        gemini_result = analyze_event_flyer(temp_path)
        
        if gemini_result.get("analysis_status") != "success":
            return FlyerAnalysisResponse(
                analysis_id=analysis_id,
                is_event_flyer=False,
                analysis_status="gemini_error",
                raw_gemini_data=gemini_result
            )
        
        # Check if it's an event flyer
        if not gemini_result.get("is_event_flyer"):
            return FlyerAnalysisResponse(
                analysis_id=analysis_id,
                is_event_flyer=False,
                analysis_status="not_event_flyer",
                confidence=gemini_result.get("confidence"),
                raw_gemini_data=gemini_result
            )
        
        # Extract first event information (in case of multiple events)
        event_names = gemini_result.get("event_names", [])
        dates = gemini_result.get("dates", [])
        venues = gemini_result.get("venues", [])
        locations = gemini_result.get("location", [])
        
        event_title = event_names[0] if event_names else None
        event_date = dates[0] if dates else None
        venue_name = venues[0] if venues else None
        location_name = locations[0] if locations else None
        
        # Step 2: Google Maps analysis (if venue information is available)
        gmap_result = {}
        event_address = None
        address_components = None
        country = None
        administrative_area_level_1 = None
        locality = None
        event_geocode = None
        
        if venue_name and location_name:
            print(f"Calling Google Maps API with: venue='{venue_name}', location='{location_name}'")
            gmap_result = get_place_details_english(venue_name, location_name)
            print(f"Google Maps API result: {gmap_result}")
            
            if gmap_result:
                event_address = gmap_result.get("formatted_address")
                address_components = gmap_result.get("address_components", [])
                country = gmap_result.get("country", "")
                administrative_area_level_1 = gmap_result.get("administrative_area_level_1", "")
                locality = gmap_result.get("locality", "")
                
                lat = gmap_result.get("latitude")
                lng = gmap_result.get("longitude")
                print(f"Extracted coordinates: lat={lat}, lng={lng}")
                print(f"Address components: Country={country}, Prefecture={administrative_area_level_1}, Locality={locality}")
                
                if lat and lng:
                    event_geocode = [float(lat), float(lng)]
                    print(f"Final geocode: {event_geocode}")
            else:
                print("No result from Google Maps API")
        
        return FlyerAnalysisResponse(
            analysis_id=analysis_id,
            is_event_flyer=True,
            event_title=event_title,
            event_date=event_date,
            event_venue=venue_name,
            event_address=event_address,
            address_components=address_components,
            country=country,
            administrative_area_level_1=administrative_area_level_1,
            locality=locality,
            event_geocode=event_geocode,
            analysis_status="success",
            confidence=gemini_result.get("confidence"),
            raw_gemini_data=gemini_result,
            raw_gmap_data=gmap_result
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
    
    finally:
        # Clean up temporary file
        if 'temp_path' in locals():
            try:
                os.unlink(temp_path)
            except:
                pass

@app.post("/search-venues", response_model=VenueSearchResponse)
async def search_venues(venue_name: str, location_hint: str = ""):
    """
    Search for venues by name with optional location hint.
    Returns multiple venue candidates for user selection.
    """
    try:
        venues = search_venues_by_name(venue_name, location_hint)
        
        return VenueSearchResponse(
            venues=venues,
            search_status="success"
        )
        
    except Exception as e:
        return VenueSearchResponse(
            venues=[],
            search_status="error",
            error_message=f"Venue search failed: {str(e)}"
        )

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Flyer Analysis API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)