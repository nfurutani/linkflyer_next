import os
import requests
from typing import Optional, Dict, Any, List
from dotenv import load_dotenv

# Load environment variables from .env.local file
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(env_path)

def get_place_details_english(store_name: str, address: str) -> Dict[str, Any]:
    """
    Retrieves Google Maps Places API information for a given store name and address in English.
    Specifically extracts address_components for country, administrative_area_level_1, and locality.
    
    Args:
        store_name (str): The name of the store/venue to search for.
        address (str): The address/location of the store to search for.
    
    Returns:
        Dict[str, Any]: A dictionary containing the retrieved information, or empty dict if not found.
    """
    google_api_key = os.getenv("NEXT_PUBLIC_GOOGLE_API_KEY")
    if not google_api_key:
        print("Error: NEXT_PUBLIC_GOOGLE_API_KEY is not set.")
        return {}

    base_url = "https://maps.googleapis.com/maps/api/place/"

    # 1. Use Find Place to get the Place ID
    find_place_url = f"{base_url}findplacefromtext/json"
    find_place_params = {
        "input": f"{store_name}, {address}",
        "inputtype": "textquery",
        "fields": "place_id",
        "key": google_api_key,
        "language": "en"
    }
    
    print(f"Searching for: {store_name}, {address}")

    try:
        find_place_response = requests.get(find_place_url, params=find_place_params)
        find_place_response.raise_for_status()
        find_place_data = find_place_response.json()
    except requests.exceptions.RequestException as e:
        print(f"Find Place Request Error: {e}")
        return {}
    except ValueError:
        print("Find Place response is not in JSON format.")
        return {}

    if not find_place_data.get("candidates"):
        print(f"No Place ID found for: '{store_name}, {address}'")
        return {}

    place_id = find_place_data["candidates"][0]["place_id"]
    print(f"Found Place ID: {place_id}")

    # 2. Use Place Details to get detailed information including address_components
    place_details_url = f"{base_url}details/json"
    fields = "place_id,name,formatted_address,address_components,geometry,website,business_status"
    place_details_params = {
        "place_id": place_id,
        "fields": fields,
        "key": google_api_key,
        "language": "en"
    }

    try:
        place_details_response = requests.get(place_details_url, params=place_details_params)
        place_details_response.raise_for_status()
        place_details_data = place_details_response.json()
    except requests.exceptions.RequestException as e:
        print(f"Place Details Request Error: {e}")
        return {}
    except ValueError:
        print("Place Details response is not in JSON format.")
        return {}

    if place_details_data.get("status") == "OK":
        result = place_details_data["result"]
        location = result.get("geometry", {}).get("location", {})
        address_components = result.get("address_components", [])
        
        # Extract specific address components
        country = ""
        administrative_area_level_1 = ""
        locality = ""
        
        for component in address_components:
            types = component.get("types", [])
            if "country" in types:
                country = component.get("short_name", "")
            elif "administrative_area_level_1" in types:
                administrative_area_level_1 = component.get("short_name", "")
            elif "locality" in types:
                locality = component.get("short_name", "")
        
        extracted_info = {
            "place_id": result.get("place_id"),
            "gmap_name": result.get("name"),
            "formatted_address": result.get("formatted_address"),
            "address_components": address_components,
            "country": country,
            "administrative_area_level_1": administrative_area_level_1,
            "locality": locality,
            "latitude": location.get("lat", ""),
            "longitude": location.get("lng", ""),
            "website": result.get("website"),
            "business_status": result.get("business_status"),
        }
        
        print(f"Successfully extracted information for: {extracted_info.get('gmap_name')}")
        print(f"Address components: Country={country}, Prefecture={administrative_area_level_1}, Locality={locality}")
        
        return extracted_info
    else:
        print(f"Place Details request failed with status: {place_details_data.get('status')}")
        return {}

def search_venues_by_name(venue_name: str, location_hint: str = "") -> List[Dict[str, Any]]:
    """
    Search for venues by name with optional location hint.
    Returns multiple candidates for user selection.
    
    Args:
        venue_name (str): Name of the venue to search for
        location_hint (str): Optional location hint to improve search accuracy
    
    Returns:
        List[Dict[str, Any]]: List of venue candidates with their information
    """
    google_api_key = os.getenv("NEXT_PUBLIC_GOOGLE_API_KEY")
    if not google_api_key:
        return []

    search_query = venue_name
    if location_hint:
        search_query = f"{venue_name} {location_hint}"

    base_url = "https://maps.googleapis.com/maps/api/place/"
    find_place_url = f"{base_url}findplacefromtext/json"
    
    find_place_params = {
        "input": search_query,
        "inputtype": "textquery",
        "fields": "place_id,name,formatted_address,geometry",
        "key": google_api_key,
        "language": "en"
    }

    try:
        response = requests.get(find_place_url, params=find_place_params)
        response.raise_for_status()
        data = response.json()
        
        candidates = []
        for candidate in data.get("candidates", []):
            # Get detailed information for each candidate
            place_details = get_place_details_by_id(candidate["place_id"])
            if place_details:
                candidates.append(place_details)
        
        return candidates[:5]  # Return top 5 candidates
        
    except Exception as e:
        print(f"Venue search error: {e}")
        return []

def get_place_details_by_id(place_id: str) -> Dict[str, Any]:
    """
    Get detailed place information by place_id.
    
    Args:
        place_id (str): Google Places API place_id
    
    Returns:
        Dict[str, Any]: Place details information
    """
    google_api_key = os.getenv("NEXT_PUBLIC_GOOGLE_API_KEY")
    if not google_api_key:
        return {}

    base_url = "https://maps.googleapis.com/maps/api/place/"
    place_details_url = f"{base_url}details/json"
    
    fields = "place_id,name,formatted_address,address_components,geometry,website,business_status"
    place_details_params = {
        "place_id": place_id,
        "fields": fields,
        "key": google_api_key,
        "language": "en"
    }

    try:
        response = requests.get(place_details_url, params=place_details_params)
        response.raise_for_status()
        data = response.json()
        
        if data.get("status") == "OK":
            result = data["result"]
            location = result.get("geometry", {}).get("location", {})
            address_components = result.get("address_components", [])
            
            # Extract specific address components
            country = ""
            administrative_area_level_1 = ""
            locality = ""
            
            for component in address_components:
                types = component.get("types", [])
                if "country" in types:
                    country = component.get("short_name", "")
                elif "administrative_area_level_1" in types:
                    administrative_area_level_1 = component.get("short_name", "")
                elif "locality" in types:
                    locality = component.get("short_name", "")
            
            return {
                "place_id": result.get("place_id"),
                "gmap_name": result.get("name"),
                "formatted_address": result.get("formatted_address"),
                "address_components": address_components,
                "country": country,
                "administrative_area_level_1": administrative_area_level_1,
                "locality": locality,
                "latitude": location.get("lat", ""),
                "longitude": location.get("lng", ""),
                "website": result.get("website"),
                "business_status": result.get("business_status"),
            }
        
        return {}
        
    except Exception as e:
        print(f"Place details error: {e}")
        return {}

if __name__ == "__main__":
    # Test the function
    test_venue = "渋谷クラブクアトロ"
    test_location = "東京"
    
    result = get_place_details_english(test_venue, test_location)
    if result:
        print("Test successful!")
        print(f"Name: {result.get('gmap_name')}")
        print(f"Address: {result.get('formatted_address')}")
        print(f"Country: {result.get('country')}")
        print(f"Prefecture: {result.get('administrative_area_level_1')}")
        print(f"Locality: {result.get('locality')}")
    else:
        print("Test failed - no results found")