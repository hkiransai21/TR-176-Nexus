// src/utils/constants.js

export const RISK_LEVELS = {
  LOW: { label: 'LOW', color: '#22c55e', bg: '#052e16', score: [0, 25], priority: 1 },
  MODERATE: { label: 'MODERATE', color: '#f59e0b', bg: '#451a03', score: [26, 50], priority: 2 },
  HIGH: { label: 'HIGH', color: '#ef4444', bg: '#450a0a', score: [51, 75], priority: 3 },
  CRITICAL: { label: 'CRITICAL', color: '#a855f7', bg: '#2e1065', score: [76, 100], priority: 4 },
};

export const WEIGHTS = {
  RAINFALL: 0.35,
  RIVER_LEVEL: 0.30,
  ELEVATION: 0.20,
  HISTORICAL: 0.15,
};

export const UPDATE_INTERVAL = 30000; // 30 seconds

export const DISTRICTS = [
  { id: 'salem', name: 'Salem', lat: 11.6643, lon: 78.1460, pincode: '636001' },
  { id: 'namakkal', name: 'Namakkal', lat: 11.2189, lon: 78.1674, pincode: '637001' },
  { id: 'erode', name: 'Erode', lat: 11.3410, lon: 77.7172, pincode: '638001' },
  { id: 'coimbatore', name: 'Coimbatore', lat: 11.0168, lon: 76.9558, pincode: '641001' },
  { id: 'chennai', name: 'Chennai', lat: 13.0827, lon: 80.2707, pincode: '600001' },
  { id: 'kancheepuram', name: 'Kancheepuram', lat: 12.8185, lon: 79.6947, pincode: '631501' },
  { id: 'tiruvallur', name: 'Tiruvallur', lat: 13.1439, lon: 79.9079, pincode: '602001' },
  { id: 'thanjavur', name: 'Thanjavur', lat: 10.7870, lon: 79.1378, pincode: '613001' },
  { id: 'nagapattinam', name: 'Nagapattinam', lat: 10.7672, lon: 79.8449, pincode: '611001' },
  { id: 'madurai', name: 'Madurai', lat: 9.9252, lon: 78.1198, pincode: '625001' },
  { id: 'dindigul', name: 'Dindigul', lat: 10.3624, lon: 77.9695, pincode: '624001' },
  { id: 'vellore', name: 'Vellore', lat: 12.9165, lon: 79.1325, pincode: '632001' },
  { id: 'tiruvannamalai', name: 'Tiruvannamalai', lat: 12.2253, lon: 79.0747, pincode: '606601' },
  { id: 'tiruvarur', name: 'Tiruvarur', lat: 10.7726, lon: 79.6365, pincode: '610001' },
  { id: 'theni', name: 'Theni', lat: 10.0104, lon: 77.4770, pincode: '625531' },
];

export const ALERT_TEMPLATES = {
  OFFICIAL_MODERATE: (district, score) =>
    `[FLOOD ADVISORY] District: ${district} | Risk Level: MODERATE (Score: ${score}) | Rainfall intensifying. Pre-position emergency teams. Monitor river levels every 2 hours. Contact: DM Office`,
  OFFICIAL_HIGH: (district, score) =>
    `[FLOOD WARNING] District: ${district} | Risk Level: HIGH (Score: ${score}) | IMMEDIATE ACTION REQUIRED. Deploy NDRF/SDRF teams. Open relief camps. Begin low-lying area evacuation. Helpline: 1800-200-0008`,
  OFFICIAL_CRITICAL: (district, score) =>
    `[CRITICAL FLOOD ALERT] District: ${district} | Score: ${score}/100 | MAXIMUM EMERGENCY. Mandatory evacuation of all flood-prone zones. All roads to flood plains CLOSED. Army assistance requested.`,
  RESIDENT_MODERATE: (district) =>
    `[Flood Watch] Your area (${district}) is under MODERATE flood watch. Please avoid low-lying areas, store drinking water (min 3 days), keep emergency kit ready. Stay tuned to All India Radio 101.4 FM`,
  RESIDENT_HIGH: (district) =>
    `[FLOOD WARNING - ${district}] EVACUATE low-lying areas NOW. Move to designated shelters. Carry ID, medicines, essentials. Do NOT cross flooded roads. Emergency: 112 | District Control Room: 0427-2450555`,
  RESIDENT_CRITICAL: (district) =>
    `[EMERGENCY EVACUATION - ${district}] LEAVE IMMEDIATELY. Mandatory evacuation in effect. Follow police/NDRF instructions. Move to higher ground. Emergency: 112. Do not wait.`,
};