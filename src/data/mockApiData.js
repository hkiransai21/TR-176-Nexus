// src/data/mockApiData.js
// Realistic mock data for Tamil Nadu districts
// Used when real APIs are unavailable or for demo mode

export const MOCK_WEATHER_DATA = {
  salem: { rainfall: 28.4, humidity: 88, temp: 24.2, windSpeed: 18, condition: 'Heavy Rain' },
  namakkal: { rainfall: 15.2, humidity: 79, temp: 25.8, windSpeed: 12, condition: 'Moderate Rain' },
  erode: { rainfall: 8.1, humidity: 72, temp: 27.1, windSpeed: 9, condition: 'Light Rain' },
  coimbatore: { rainfall: 45.7, humidity: 94, temp: 21.3, windSpeed: 28, condition: 'Very Heavy Rain' },
  chennai: { rainfall: 62.3, humidity: 97, temp: 22.1, windSpeed: 35, condition: 'Extremely Heavy Rain' },
  kancheepuram: { rainfall: 55.8, humidity: 95, temp: 22.8, windSpeed: 31, condition: 'Very Heavy Rain' },
  tiruvallur: { rainfall: 48.2, humidity: 93, temp: 23.1, windSpeed: 27, condition: 'Very Heavy Rain' },
  thanjavur: { rainfall: 22.6, humidity: 85, temp: 25.4, windSpeed: 14, condition: 'Moderate Rain' },
  nagapattinam: { rainfall: 38.9, humidity: 91, temp: 23.7, windSpeed: 22, condition: 'Heavy Rain' },
  madurai: { rainfall: 5.3, humidity: 68, temp: 28.9, windSpeed: 7, condition: 'Drizzle' },
  dindigul: { rainfall: 3.1, humidity: 62, temp: 29.4, windSpeed: 5, condition: 'Cloudy' },
  vellore: { rainfall: 19.4, humidity: 81, temp: 26.1, windSpeed: 11, condition: 'Moderate Rain' },
  tiruvannamalai: { rainfall: 12.8, humidity: 76, temp: 26.8, windSpeed: 10, condition: 'Light Rain' },
  tiruvarur: { rainfall: 31.5, humidity: 89, temp: 24.5, windSpeed: 17, condition: 'Heavy Rain' },
  theni: { rainfall: 2.1, humidity: 58, temp: 30.2, windSpeed: 4, condition: 'Partly Cloudy' },
};

export const MOCK_RIVER_DATA = {
  salem: { riverName: 'Thirumanimuttar', level: 78, maxLevel: 12.5, currentM: 9.75, status: 'Warning' },
  namakkal: { riverName: 'Cauvery', level: 55, maxLevel: 18.2, currentM: 10.01, status: 'Watch' },
  erode: { riverName: 'Cauvery', level: 43, maxLevel: 22.1, currentM: 9.50, status: 'Normal' },
  coimbatore: { riverName: 'Bhavani', level: 82, maxLevel: 15.3, currentM: 12.55, status: 'Danger' },
  chennai: { riverName: 'Cooum River', level: 91, maxLevel: 8.4, currentM: 7.64, status: 'Extreme Danger' },
  kancheepuram: { riverName: 'Palar', level: 87, maxLevel: 10.8, currentM: 9.40, status: 'Danger' },
  tiruvallur: { riverName: 'Araniyar', level: 80, maxLevel: 7.2, currentM: 5.76, status: 'Danger' },
  thanjavur: { riverName: 'Cauvery', level: 62, maxLevel: 25.4, currentM: 15.75, status: 'Watch' },
  nagapattinam: { riverName: 'Vellar', level: 74, maxLevel: 9.1, currentM: 6.73, status: 'Warning' },
  madurai: { riverName: 'Vaigai', level: 31, maxLevel: 14.6, currentM: 4.53, status: 'Normal' },
  dindigul: { riverName: 'Kodaganar', level: 22, maxLevel: 8.3, currentM: 1.83, status: 'Normal' },
  vellore: { riverName: 'Palar', level: 58, maxLevel: 11.7, currentM: 6.79, status: 'Watch' },
  tiruvannamalai: { riverName: 'Cheyyar', level: 47, maxLevel: 6.8, currentM: 3.20, status: 'Normal' },
  tiruvarur: { riverName: 'Grand Anicut Canal', level: 71, maxLevel: 5.2, currentM: 3.69, status: 'Warning' },
  theni: { riverName: 'Vaigai', level: 18, maxLevel: 16.9, currentM: 3.04, status: 'Normal' },
};

export const MOCK_ELEVATION_DATA = {
  salem: 278,
  namakkal: 184,
  erode: 156,
  coimbatore: 399,
  chennai: 6,       // Nearly sea level - high flood risk
  kancheepuram: 83,
  tiruvallur: 24,   // Very low - high flood risk
  thanjavur: 58,
  nagapattinam: 4,  // Coastal, very low
  madurai: 101,
  dindigul: 272,
  vellore: 216,
  tiruvannamalai: 184,
  tiruvarur: 11,    // Very low
  theni: 348,
};

export const MOCK_FORECAST_RAINFALL = {
  // 24 data points = 3-hour intervals for 72 hours
  salem: [30, 35, 40, 38, 32, 28, 22, 18, 15, 20, 25, 30, 28, 22, 18, 14, 10, 8, 6, 5, 4, 4, 3, 2],
  chennai: [65, 72, 80, 85, 78, 70, 62, 55, 48, 52, 58, 65, 60, 52, 45, 38, 30, 22, 18, 14, 10, 8, 6, 4],
  coimbatore: [48, 52, 55, 58, 52, 45, 40, 35, 30, 28, 25, 22, 20, 18, 16, 14, 12, 10, 8, 6, 5, 4, 3, 2],
  nagapattinam: [40, 45, 48, 50, 46, 42, 38, 35, 30, 28, 32, 38, 42, 40, 35, 30, 25, 20, 15, 12, 10, 8, 6, 4],
  default: [10, 12, 15, 14, 12, 10, 8, 7, 6, 5, 5, 6, 7, 7, 6, 5, 4, 4, 3, 3, 2, 2, 2, 1],
};

export function getForecastRainfall(districtId) {
  return MOCK_FORECAST_RAINFALL[districtId] || MOCK_FORECAST_RAINFALL.default;
}