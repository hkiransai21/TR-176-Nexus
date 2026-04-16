// src/utils/alertFormatter.js
import { ALERT_TEMPLATES } from './constants';
import { format } from 'date-fns';

let alertIdCounter = 1;

export function createAlert({ district, riskLevel, score, type = 'SYSTEM' }) {
  const id = `ALERT-${String(alertIdCounter++).padStart(4, '0')}`;
  const timestamp = new Date();

  const officialMsg = getOfficialMessage(district, riskLevel, score);
  const residentMsg = getResidentMessage(district, riskLevel);

  return {
    id,
    timestamp: timestamp.toISOString(),
    displayTime: format(timestamp, 'HH:mm:ss dd MMM'),
    district,
    riskLevel,
    score,
    type,
    officialSMS: officialMsg,
    residentSMS: residentMsg,
    sentToOfficials: riskLevel !== 'LOW',
    sentToResidents: ['HIGH', 'CRITICAL'].includes(riskLevel),
    acknowledged: false,
  };
}

function getOfficialMessage(district, riskLevel, score) {
  switch (riskLevel) {
    case 'MODERATE': return ALERT_TEMPLATES.OFFICIAL_MODERATE(district, score);
    case 'HIGH': return ALERT_TEMPLATES.OFFICIAL_HIGH(district, score);
    case 'CRITICAL': return ALERT_TEMPLATES.OFFICIAL_CRITICAL(district, score);
    default: return `[INFO] ${district}: Risk level LOW (${score}/100). No action required.`;
  }
}

function getResidentMessage(district, riskLevel) {
  switch (riskLevel) {
    case 'MODERATE': return ALERT_TEMPLATES.RESIDENT_MODERATE(district);
    case 'HIGH': return ALERT_TEMPLATES.RESIDENT_HIGH(district);
    case 'CRITICAL': return ALERT_TEMPLATES.RESIDENT_CRITICAL(district);
    default: return null;
  }
}

export function estimateLeadTime(forecastTrend) {
  // Find when score first crosses HIGH threshold
  const highThreshold = forecastTrend.find(p => p.score > 50);
  if (!highThreshold) return null;

  const hoursLabel = highThreshold.label;
  const hours = parseInt(hoursLabel);
  return hours;
}

export function formatAlertCount(alerts) {
  return {
    total: alerts.length,
    critical: alerts.filter(a => a.riskLevel === 'CRITICAL').length,
    high: alerts.filter(a => a.riskLevel === 'HIGH').length,
    moderate: alerts.filter(a => a.riskLevel === 'MODERATE').length,
    unacknowledged: alerts.filter(a => !a.acknowledged).length,
  };
}