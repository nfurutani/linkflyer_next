import os
import google.generativeai as genai
from typing import Dict, Any, Optional
import json
from dotenv import load_dotenv

# Load environment variables from .env.local file
env_path = os.path.join(os.path.dirname(__file__), '..', '.env.local')
load_dotenv(env_path)

def analyze_event_flyer(image_path: str) -> Dict[str, Any]:
    """
    Analyzes an event flyer image using Google Gemini AI to extract event information.
    
    Args:
        image_path (str): Path to the flyer image file
    
    Returns:
        Dict[str, Any]: Analysis results containing event information
    """
    api_key = os.getenv("NEXT_PUBLIC_GOOGLE_API_KEY")
    if not api_key:
        return {
            "analysis_status": "error",
            "error_message": "NEXT_PUBLIC_GOOGLE_API_KEY environment variable is not set"
        }
    
    try:
        # Configure Gemini API
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Upload the image file
        uploaded_file = genai.upload_file(image_path)
        
        # Create the prompt for event flyer analysis
        prompt = """
        Analyze this image and determine if it's an event flyer. If it is an event flyer, extract the following information:
        
        1. Event names (list of event names if multiple)
        2. Event dates (list of dates in YYYY-MM-DD format if possible)
        3. Venue names (list of venue names)
        4. Location information (list of addresses or location descriptions)
        
        Respond in the following JSON format:
        {
            "is_event_flyer": true/false,
            "confidence": 0.0-1.0,
            "event_names": ["event name 1", "event name 2"],
            "dates": ["2024-01-01", "2024-01-02"],
            "venues": ["venue name 1", "venue name 2"],
            "location": ["location 1", "location 2"]
        }
        
        If it's not an event flyer, set is_event_flyer to false and confidence accordingly.
        Extract text as accurately as possible. If dates are unclear, try to infer from context.
        """
        
        # Generate content
        response = model.generate_content([uploaded_file, prompt])
        
        # Parse the JSON response
        try:
            # Clean the response text to extract JSON
            response_text = response.text
            if "```json" in response_text:
                json_start = response_text.find("```json") + 7
                json_end = response_text.find("```", json_start)
                response_text = response_text[json_start:json_end].strip()
            elif "```" in response_text:
                json_start = response_text.find("```") + 3
                json_end = response_text.rfind("```")
                response_text = response_text[json_start:json_end].strip()
            
            result = json.loads(response_text)
            result["analysis_status"] = "success"
            result["raw_response"] = response.text
            
            return result
            
        except json.JSONDecodeError as e:
            return {
                "analysis_status": "json_parse_error",
                "error_message": f"Failed to parse JSON response: {str(e)}",
                "raw_response": response.text
            }
            
    except Exception as e:
        return {
            "analysis_status": "error",
            "error_message": f"Gemini API analysis failed: {str(e)}"
        }

if __name__ == "__main__":
    # Test the function with a sample image
    test_image_path = "sample_flyer.jpg"
    if os.path.exists(test_image_path):
        result = analyze_event_flyer(test_image_path)
        print(json.dumps(result, indent=2, ensure_ascii=False))
    else:
        print("Test image not found. Please provide a sample flyer image.")