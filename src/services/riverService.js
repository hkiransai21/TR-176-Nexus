// src/services/riverService.js
import { MOCK_RIVER_DATA } from '../data/mockApiData';

/**
 * Fetch river/reservoir level for a district.
 *
 * NOTE: India's Water Resources Information System (WRIS) API at
 * https://indiawris.gov.in/ requires institutional access.
 * This service simulates realistic river data based on Tamil Nadu rivers.
 * 
 * To connect real API:
 *   Replace the mock return with an axios call to the WRIS endpoint.
 *   Endpoint pattern: GET https://indiawris.gov.in/api/v1/riverlevel?district={id}
 */
export async function fetchRiverLevel(districtId) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 100));

  const data = MOCK_RIVER_DATA[districtId];
  if (!data) {
    return {
      riverName: 'Unknown',
      level: 30,
      maxLevel: 10,
      currentM: 3,
      status: 'Normal',
      source: 'MOCK',
    };
  }

  // Add small random variation to simulate live readings
  const variation = (Math.random() - 0.5) * 4;
  const level = Math.min(100, Math.max(0, data.level + variation));

  return {
    ...data,
    level: Math.round(level * 10) / 10,
    source: 'MOCK_SIMULATION',
  };
}

/**
 * Batch fetch for all districts
 */
export async function fetchAllRiverLevels(districts) {
  const results = await Promise.all(
    districts.map(d => fetchRiverLevel(d.id).then(r => ({ ...r, districtId: d.id })))
  );
  return results;
}