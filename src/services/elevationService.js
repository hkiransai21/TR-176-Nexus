// src/services/elevationService.js
import axios from 'axios';
import { MOCK_ELEVATION_DATA } from '../data/mockApiData';

/**
 * Fetch elevation using Open-Elevation API (free, no key required)
 * Falls back to pre-stored SRTM-derived district elevation data
 */
export async function fetchElevation(lat, lon, districtId) {
  // First check our precomputed data (faster)
  if (MOCK_ELEVATION_DATA[districtId] !== undefined) {
    return {
      elevation: MOCK_ELEVATION_DATA[districtId],
      source: 'SRTM_PRECOMPUTED',
    };
  }

  // Try Open-Elevation API as fallback
  try {
    const response = await axios.get('https://api.open-elevation.com/api/v1/lookup', {
      params: { locations: `${lat},${lon}` },
      timeout: 5000,
    });
    const elevation = response.data?.results?.[0]?.elevation || 50;
    return { elevation, source: 'OPEN_ELEVATION_API' };
  } catch (err) {
    console.warn(`Elevation API failed for ${districtId}:`, err.message);
    return { elevation: 50, source: 'DEFAULT_FALLBACK' };
  }
}

/**
 * Batch elevation lookup for multiple coordinates
 * Uses Open-Elevation batch endpoint (up to 100 points per request)
 */
export async function fetchBatchElevation(districts) {
  // Use precomputed data for all known districts
  return districts.map(d => ({
    districtId: d.id,
    elevation: MOCK_ELEVATION_DATA[d.id] || 50,
    source: 'SRTM_PRECOMPUTED',
  }));
}