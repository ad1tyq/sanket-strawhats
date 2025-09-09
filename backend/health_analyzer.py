# health_analyzer.py
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json

class HealthDataAnalyzer:
    def __init__(self, base_url="http://127.0.0.1:8000"):
        self.base_url = base_url
    
    def fetch_all_data(self):
        """Fetch only community reports data from the API"""
        try:
            response = requests.get(f"{self.base_url}/get_all_data")
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Error fetching data: {response.status_code}")
                return None
        except requests.exceptions.RequestException as e:
            print(f"Connection error: {e}")
            return None
    
    def analyze_outbreak_patterns(self, data: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Analyze patterns only from community reports"""
        analysis_results = []
        
        # Get only community reports
        all_reports = data.get('community_reports', {}).get('reports', [])
        
        if not all_reports:
            return [{"type": "no_data", "message": "No health reports available for analysis"}]
        
        disease_clusters = {}
        location_clusters = {}
        
        for report in all_reports:
            disease_type = report.get('estimatedDisease') or 'unknown'
            location = report.get('village') or 'unknown'
            
            if disease_type not in disease_clusters:
                disease_clusters[disease_type] = []
            disease_clusters[disease_type].append(report)
            
            if location not in location_clusters:
                location_clusters[location] = []
            location_clusters[location].append(report)
        
        # Analyze disease patterns
        for disease, reports in disease_clusters.items():
            if disease != 'unknown' and len(reports) >= 1:  # Reduced threshold to 1 report
                analysis = self._analyze_disease_cluster(disease, reports)
                analysis_results.append(analysis)
        
        # Analyze location patterns
        for location, reports in location_clusters.items():
            if location != 'unknown' and len(reports) >= 1:  # Reduced threshold to 1 report
                analysis = self._analyze_location_cluster(location, reports)
                analysis_results.append(analysis)
        
        # Check for high-risk individual reports
        for report in all_reports:
            if report.get('risk_level') == 'High' and report.get('cases', 0) >= 5:  # Lowered threshold
                analysis = self._analyze_high_risk_report(report)
                analysis_results.append(analysis)
        
        return analysis_results
    
    def _analyze_disease_cluster(self, disease: str, reports: List[Dict]) -> Dict[str, Any]:
        total_cases = sum(report.get('cases', 0) for report in reports)
        locations = list(set(report.get('village') for report in reports))
        recent_reports = [r for r in reports if self._is_recent(r.get('reportedDate') or r.get('timestamp'))]
        
        severity = "MODERATE"
        if total_cases > 20 or len(recent_reports) >= 2:  # Adjusted thresholds
            severity = "HIGH"
        elif total_cases > 10:
            severity = "ELEVATED"
        
        return {
            "type": "disease_cluster",
            "disease": disease,
            "total_cases": total_cases,
            "affected_locations": locations,
            "report_count": len(reports),
            "severity": severity,
            "actions": self._generate_disease_actions(disease, total_cases, locations, severity),
            "timestamp": datetime.now().isoformat()
        }
    
    def _analyze_location_cluster(self, location: str, reports: List[Dict]) -> Dict[str, Any]:
        diseases = list(set(report.get('estimatedDisease') for report in reports))
        total_cases = sum(report.get('cases', 0) for report in reports)
        high_risk_count = sum(1 for report in reports if report.get('risk_level') == 'High')
        
        severity = "MODERATE"
        if total_cases > 15 or high_risk_count >= 1:  # Adjusted thresholds
            severity = "HIGH"
        elif total_cases > 8:
            severity = "ELEVATED"
        
        return {
            "type": "location_cluster",
            "location": location,
            "total_cases": total_cases,
            "diseases_present": diseases,
            "high_risk_reports": high_risk_count,
            "severity": severity,
            "actions": self._generate_location_actions(location, diseases, total_cases, severity),
            "timestamp": datetime.now().isoformat()
        }
    
    def _analyze_high_risk_report(self, report: Dict) -> Dict[str, Any]:
        disease = report.get('estimatedDisease') or 'unknown'
        location = report.get('village') or 'unknown'
        cases = report.get('cases', 0)
        
        return {
            "type": "high_risk_individual",
            "disease": disease,
            "location": location,
            "cases": cases,
            "severity": "HIGH",
            "actions": self._generate_immediate_actions(disease, location, cases, report),
            "timestamp": datetime.now().isoformat(),
            "source_report": report.get('id', 'unknown')
        }
    
    def _generate_disease_actions(self, disease: str, total_cases: int, locations: List[str], severity: str) -> List[str]:
        actions = []
        
        if severity == "HIGH":
            actions.append(f"IMMEDIATE: Dispatch rapid response team for {disease} outbreak")
            actions.append(f"Alert all health centers in {', '.join(locations)} about {disease} cases")
        elif severity == "ELEVATED":
            actions.append(f"Increase surveillance for {disease} in affected areas")
        
        # Disease-specific actions
        if disease.lower() in ['cholera', 'diarrhea', 'dysentery']:
            actions.append("Test water sources in affected areas for contamination")
            actions.append("Distribute oral rehydration salts (ORS) packets")
        elif disease.lower() == 'typhoid':
            actions.append("Check vaccination coverage in affected areas")
        elif disease.lower() == 'jaundice':
            actions.append("Test for hepatitis viruses")
        
        actions.append(f"Monitor {disease} cases daily for next 7 days")
        actions.append("Submit situation report to district health authority")
        
        return actions
    
    def _generate_location_actions(self, location: str, diseases: List[str], total_cases: int, severity: str) -> List[str]:
        actions = []
        
        if severity == "HIGH":
            actions.append(f"IMMEDIATE: Deploy mobile health unit to {location}")
            actions.append(f"Conduct door-to-door screening in {location}")
        elif severity == "ELEVATED":
            actions.append(f"Increase health worker visits to {location}")
        
        if any(d.lower() in ['cholera', 'diarrhea', 'dysentery'] for d in diseases):
            actions.append("Emergency water quality testing in the area")
        
        if total_cases > 10:
            actions.append("Coordinate with local administration for support")
        
        actions.append(f"Establish daily reporting system from {location}")
        
        return actions
    
    def _generate_immediate_actions(self, disease: str, location: str, cases: int, report: Dict) -> List[str]:
        actions = [
            f"IMMEDIATE: Investigate {cases} {disease} cases in {location} within 24 hours",
            f"Send rapid diagnostic test kits for {disease}",
            "Trace contacts of affected individuals"
        ]
        
        symptoms = report.get('symptoms_text', '')
        if symptoms:
            actions.append(f"Focus on symptom management: {symptoms[:100]}...")
        
        if report.get('water_status') == 'contaminated':
            actions.append("URGENT: Test and treat water sources immediately")
        
        if cases >= 15:
            actions.append("Consider requesting state-level support")
        
        return actions
    
    def _is_recent(self, date_string: str) -> bool:
        try:
            if not date_string:
                return False
            report_date = datetime.fromisoformat(date_string.replace('Z', ''))
            return (datetime.now() - report_date) < timedelta(days=7)
        except:
            return False
    
    def generate_comprehensive_analysis(self) -> Dict[str, Any]:
        data = self.fetch_all_data()
        if not data:
            return {"error": "Could not fetch data from API"}
        
        patterns = self.analyze_outbreak_patterns(data)
        
        high_priority = [p for p in patterns if p.get('severity') == 'HIGH']
        medium_priority = [p for p in patterns if p.get('severity') in ['ELEVATED', 'MODERATE']]
        
        all_actions = []
        for pattern in patterns:
            all_actions.extend(pattern.get('actions', []))
        
        unique_actions = []
        for action in all_actions:
            if action not in unique_actions:
                unique_actions.append(action)
        
        total_reports = len(data.get('community_reports', {}).get('reports', []))
        
        return {
            "analysis_timestamp": datetime.now().isoformat(),
            "total_reports": total_reports,
            "high_risk_patterns": len(high_priority),
            "moderate_risk_patterns": len(medium_priority),
            "patterns_detected": patterns,
            "recommended_actions": unique_actions,
            "priority_summary": {
                "immediate_actions": [action for action in unique_actions if action.startswith('IMMEDIATE:') or action.startswith('URGENT:')],
                "high_priority_actions": [action for action in unique_actions if not action.startswith(('IMMEDIATE:', 'URGENT:')) and 'emergency' in action.lower()],
                "standard_actions": [action for action in unique_actions if not any(x in action for x in ['IMMEDIATE:', 'URGENT:', 'emergency'])]
            }
        }

# For testing the analyzer standalone
if __name__ == "__main__":
    analyzer = HealthDataAnalyzer()
    analysis = analyzer.generate_comprehensive_analysis()
    print(json.dumps(analysis, indent=2))