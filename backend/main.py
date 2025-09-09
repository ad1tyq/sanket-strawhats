# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from datetime import datetime, timedelta
import json
import os
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List

app = FastAPI(title="Smart Community Health Monitoring Backend")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_FILE = "data.json"

def reset_data():
    """Reset database structure on server start"""
    data = {"community_reports": []}  # Only keep community reports
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)
    return data

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {"community_reports": []}  # Only community reports

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=4)

db = {"community_reports": []}  # Only community reports

@app.on_event("startup")
def startup_event():
    global db
    db = reset_data()

# --- Models ---
class CommunityReport(BaseModel):
    id: int
    reportedDate: str
    latitude: float
    longitude: float
    village: str
    symptoms: str
    estimatedDisease: str
    cases: int
    otherDetails: Optional[str] = None

# --- Risk Analysis Logic ---
def calculate_risk(cases: int, symptoms: List[str], water_status: str) -> str:
    score = 0

    if cases >= 10:
        score += 2
    elif cases >= 5:
        score += 1

    if "diarrhea" in symptoms:
        score += 2
    if "vomiting" in symptoms:
        score += 1

    if water_status.lower() == "contaminated":
        score += 2
    elif water_status.lower() == "uncertain":
        score += 1

    if score >= 6:
        return "High"
    elif score >= 3:
        return "Medium"
    else:
        return "Low"

def extract_symptoms_from_text(symptoms_text: str) -> List[str]:
    symptoms_text = symptoms_text.lower()
    symptoms_list = []
    
    symptom_mapping = {
        "diarrhea": ["diarrhea", "loose motion", "watery stool"],
        "vomiting": ["vomiting", "vomit", "throwing up"],
        "fever": ["fever", "high temperature", "feverish"],
        "abdominal pain": ["abdominal pain", "stomach pain", "stomach ache", "cramps"],
        "dehydration": ["dehydration", "dehydrated"],
        "weakness": ["weakness", "weak", "fatigue"],
        "jaundice": ["jaundice", "yellowing", "yellow eyes", "yellow skin"]
    }
    
    for symptom, keywords in symptom_mapping.items():
        for keyword in keywords:
            if keyword in symptoms_text and symptom not in symptoms_list:
                symptoms_list.append(symptom)
    
    return symptoms_list

def determine_water_status(other_details: Optional[str]) -> str:
    if not other_details:
        return "unknown"
    
    other_details_lower = other_details.lower()
    
    if any(keyword in other_details_lower for keyword in ["water", "well", "river", "source", "contaminated", "cloudy", "dirty"]):
        return "contaminated"
    elif any(keyword in other_details_lower for keyword in ["flood", "rain", "sanitation", "hygiene", "toilet"]):
        return "uncertain"
    
    return "unknown"

# --- Duplicate Prevention Logic ---
def is_duplicate_report(new_report: CommunityReport, existing_reports: List[dict]) -> bool:
    """
    Check if a report is a duplicate based on:
    - Same village
    - Same disease type
    - Similar timestamp (within 5 minutes)
    - Similar case count (±2 cases)
    """
    current_time = datetime.utcnow()
    
    for existing_report in existing_reports:
        # Check if same village and disease
        if (existing_report["village"] == new_report.village and 
            existing_report["estimatedDisease"] == new_report.estimatedDisease):
            
            # Parse existing report timestamp
            try:
                existing_time = datetime.fromisoformat(existing_report["timestamp"].replace('Z', ''))
            except:
                continue
            
            # Check if within 5 minutes
            time_diff = abs((current_time - existing_time).total_seconds())
            if time_diff < 300:  # 5 minutes
                # Check if case count is similar (±2 cases)
                case_diff = abs(existing_report["cases"] - new_report.cases)
                if case_diff <= 2:
                    return True
    return False

# --- Routes ---
@app.get("/")
def home():
    return {"msg": "Smart Health Monitoring API is running 🚀"}

@app.post("/submit_community_report/")
def submit_community_report(report: CommunityReport):
    # Load current reports
    existing_reports = db.get("community_reports", [])
    
    # Check for duplicates
    if is_duplicate_report(report, existing_reports):
        return {
            "status": "error", 
            "message": "Duplicate report detected. A similar report was already submitted recently.",
            "code": "DUPLICATE_REPORT"
        }
    
    symptoms_list = extract_symptoms_from_text(report.symptoms)
    water_status = determine_water_status(report.otherDetails)
    
    # Generate a more unique ID using timestamp
    unique_id = int(datetime.utcnow().timestamp() * 1000)
    
    entry = {
        "id": unique_id,  # Use unique timestamp-based ID
        "reportedDate": report.reportedDate,
        "timestamp": datetime.utcnow().isoformat(),
        "latitude": report.latitude,
        "longitude": report.longitude,
        "village": report.village,
        "symptoms_text": report.symptoms,
        "symptoms": symptoms_list,
        "estimatedDisease": report.estimatedDisease,
        "cases": report.cases,
        "otherDetails": report.otherDetails,
        "water_status": water_status,
        "risk_level": calculate_risk(report.cases, symptoms_list, water_status)
    }
    
    # Add to database and save
    db["community_reports"].append(entry)
    save_data(db)
    
    # Log the submission for debugging
    print(f"New report submitted: {entry['village']} - {entry['estimatedDisease']} - {entry['cases']} cases")
    print(f"Total reports now: {len(db['community_reports'])}")
    
    return {"status": "success", "data": entry}

@app.get("/get_community_reports/")
def get_community_reports():
    community_reports = db.get("community_reports", [])
    for report in community_reports:
        if "risk_level" not in report:
            symptoms_list = report.get("symptoms", [])
            water_status = report.get("water_status", "unknown")
            report["risk_level"] = calculate_risk(report["cases"], symptoms_list, water_status)
    
    return {"count": len(community_reports), "reports": community_reports}

@app.get("/get_all_data/")
def get_all_data():
    """Get only community reports data"""
    return {
        "community_reports": get_community_reports()
    }

# Debug endpoint to check for duplicates
@app.get("/debug/check_duplicates/")
def debug_check_duplicates():
    """Debug endpoint to check for potential duplicates in the database"""
    reports = db.get("community_reports", [])
    duplicates = []
    
    for i, report1 in enumerate(reports):
        for j, report2 in enumerate(reports[i+1:], i+1):
            if (report1["village"] == report2["village"] and 
                report1["estimatedDisease"] == report2["estimatedDisease"]):
                
                try:
                    time1 = datetime.fromisoformat(report1["timestamp"].replace('Z', ''))
                    time2 = datetime.fromisoformat(report2["timestamp"].replace('Z', ''))
                    time_diff = abs((time1 - time2).total_seconds())
                    
                    if time_diff < 300:  # 5 minutes
                        duplicates.append({
                            "report1": report1,
                            "report2": report2,
                            "time_diff_seconds": time_diff
                        })
                except:
                    continue
    
    return {"duplicates_found": len(duplicates), "duplicates": duplicates}

@app.get("/generate_health_actions/")
def generate_health_actions():
    from health_analyzer import HealthDataAnalyzer
    try:
        analyzer = HealthDataAnalyzer()
        analysis = analyzer.generate_comprehensive_analysis()
        return analysis
    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)