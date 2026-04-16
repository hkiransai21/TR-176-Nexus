// src/services/riskEngine.js
import { fetchCurrentWeather, fetchForecastRainfall } from './weatherService';
import { fetchRiverLevel } from './riverService';
import { fetchElevation } from './elevationService';
import { calculateFloodRisk, generateForecastTrend } from '../utils/riskCalculator';
import { HISTORICAL_EVENT_COUNTS } from '../data/historicalEvents';

/**
 * Compute full flood risk assessment for a single district
 */
export async function assessDistrictRisk(district) {
  const startTime = Date.now();

  const [weatherData, riverData, elevationData, forecastRainfall] = await Promise.all([
    fetchCurrentWeather(district.lat, district.lon, district.id),
    fetchRiverLevel(district.id),
    fetchElevation(district.lat, district.lon, district.id),
    fetchForecastRainfall(district.lat, district.lon, district.id),
  ]);

  const historicalCount = HISTORICAL_EVENT_COUNTS[district.id] || 0;

  const riskResult = calculateFloodRisk({
    rainfall: weatherData.rainfall,
    riverLevel: riverData.level,
    elevation: elevationData.elevation,
    historicalCount,
  });

  const forecastTrend = generateForecastTrend(
    riskResult.score,
    forecastRainfall,
    district.id
  );

  const latencyMs = Date.now() - startTime;

  return {
    districtId: district.id,
    districtName: district.name,
    lat: district.lat,
    lon: district.lon,
    pincode: district.pincode,
    ...riskResult,
    weather: weatherData,
    river: riverData,
    elevation: elevationData,
    forecastTrend,
    historicalCount,
    lastUpdated: new Date().toISOString(),
    latencyMs,
  };
}

/**
 * Assess risk for ALL districts in parallel
 */
export async function assessAllDistricts(districts) {
  const results = await Promise.all(
    districts.map(d => assessDistrictRisk(d).catch(err => {
      console.error(`Failed to assess ${d.name}:`, err);
      return null;
    }))
  );
  return results.filter(Boolean);
}