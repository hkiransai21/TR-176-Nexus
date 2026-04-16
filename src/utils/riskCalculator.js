// src/utils/riskCalculator.js
import { WEIGHTS, RISK_LEVELS } from './constants';

/**
 * Converts rainfall intensity (mm/hr) to a 0-100 score
 */
export function rainfallScore(mmPerHour) {
  if (mmPerHour < 2.5) return 5;
  if (mmPerHour < 7.5) return 20;
  if (mmPerHour < 15) return 40;
  if (mmPerHour < 25) return 60;
  if (mmPerHour < 50) return 80;
  return 100;
}

/**
 * Converts river level percentage (0-100% of capacity) to score
 */
export function riverLevelScore(percentCapacity) {
  if (percentCapacity < 30) return 10;
  if (percentCapacity < 50) return 25;
  if (percentCapacity < 65) return 45;
  if (percentCapacity < 75) return 65;
  if (percentCapacity < 85) return 80;
  if (percentCapacity < 95) return 90;
  return 100;
}

/**
 * Converts elevation (meters above sea level) to risk score
 * Lower elevation = higher flood risk
 */
export function elevationScore(metersASL) {
  if (metersASL > 500) return 5;
  if (metersASL > 200) return 15;
  if (metersASL > 100) return 35;
  if (metersASL > 50) return 60;
  if (metersASL > 20) return 80;
  return 95;
}

/**
 * Converts historical flood count (last 10 years) to score
 */
export function historicalFrequencyScore(eventCount) {
  if (eventCount === 0) return 5;
  if (eventCount <= 1) return 20;
  if (eventCount <= 2) return 40;
  if (eventCount <= 4) return 65;
  if (eventCount <= 6) return 80;
  return 95;
}

/**
 * Main risk score calculation — weighted composite
 * Returns { score, riskLevel, breakdown }
 */
export function calculateFloodRisk({ rainfall, riverLevel, elevation, historicalCount }) {
  const rf = rainfallScore(rainfall);
  const rv = riverLevelScore(riverLevel);
  const el = elevationScore(elevation);
  const hf = historicalFrequencyScore(historicalCount);

  const score = Math.round(
    rf * WEIGHTS.RAINFALL +
    rv * WEIGHTS.RIVER_LEVEL +
    el * WEIGHTS.ELEVATION +
    hf * WEIGHTS.HISTORICAL
  );

  const clampedScore = Math.min(100, Math.max(0, score));

  let riskLevel;
  if (clampedScore <= 25) riskLevel = 'LOW';
  else if (clampedScore <= 50) riskLevel = 'MODERATE';
  else if (clampedScore <= 75) riskLevel = 'HIGH';
  else riskLevel = 'CRITICAL';

  return {
    score: clampedScore,
    riskLevel,
    riskConfig: RISK_LEVELS[riskLevel],
    breakdown: {
      rainfall: { raw: rainfall, score: rf, weighted: Math.round(rf * WEIGHTS.RAINFALL) },
      riverLevel: { raw: riverLevel, score: rv, weighted: Math.round(rv * WEIGHTS.RIVER_LEVEL) },
      elevation: { raw: elevation, score: el, weighted: Math.round(el * WEIGHTS.ELEVATION) },
      historical: { raw: historicalCount, score: hf, weighted: Math.round(hf * WEIGHTS.HISTORICAL) },
    },
  };
}

/**
 * Generate 72-hour forecast trend (24 data points, 3-hour intervals)
 * Uses forecast weather data + decay/growth model
 */
export function generateForecastTrend(currentScore, forecastRainfall, district) {
  const points = [];
  const now = new Date();

  for (let i = 0; i < 24; i++) {
    const hoursAhead = i * 3;
    const time = new Date(now.getTime() + hoursAhead * 3600000);
    const rainfallAtTime = forecastRainfall[i] || 0;

    // Apply temporal decay to base score + current rainfall effect
    const decayFactor = Math.max(0.3, 1 - (i * 0.015));
    const rainfallEffect = rainfallScore(rainfallAtTime) * WEIGHTS.RAINFALL;
    const projectedScore = Math.min(
      100,
      Math.round((currentScore * decayFactor * 0.65) + rainfallEffect)
    );

    points.push({
      time: time.toISOString(),
      label: `${hoursAhead}h`,
      score: projectedScore,
      rainfall: rainfallAtTime,
      riskLevel: projectedScore <= 25 ? 'LOW' :
                 projectedScore <= 50 ? 'MODERATE' :
                 projectedScore <= 75 ? 'HIGH' : 'CRITICAL',
    });
  }
  return points;
}

/**
 * Calibration check: compare computed score vs historical event
 * Returns accuracy percentage
 */
export function calibrateScore(computedScore, historicalSeverity) {
  // historicalSeverity: 1=minor, 2=moderate, 3=major, 4=catastrophic
  const expectedRange = {
    1: [0, 30],
    2: [25, 55],
    3: [50, 80],
    4: [70, 100],
  }[historicalSeverity] || [0, 100];

  const inRange = computedScore >= expectedRange[0] && computedScore <= expectedRange[1];
  const midpoint = (expectedRange[0] + expectedRange[1]) / 2;
  const accuracy = Math.max(0, 100 - Math.abs(computedScore - midpoint) * 2);
  return { inRange, accuracy: Math.round(accuracy) };
}