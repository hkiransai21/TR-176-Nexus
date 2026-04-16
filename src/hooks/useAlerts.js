// src/hooks/useAlerts.js
import { useState, useEffect, useRef } from 'react';
import { createAlert } from '../utils/alertFormatter';

export function useAlerts(districtRisks) {
  const [alerts, setAlerts] = useState([]);
  const [smsQueue, setSmsQueue] = useState([]);
  const prevRisksRef = useRef({});

  useEffect(() => {
    if (!districtRisks || districtRisks.length === 0) return;

    const newAlerts = [];
    const newSms = [];

    districtRisks.forEach(district => {
      const prevLevel = prevRisksRef.current[district.districtId];
      const currentLevel = district.riskLevel;

      // Generate alert if risk level changed or is above LOW
      const isEscalating = prevLevel && currentLevel !== prevLevel &&
        ['MODERATE', 'HIGH', 'CRITICAL'].includes(currentLevel);
      const isFirstLoad = !prevLevel && currentLevel !== 'LOW';

      if (isEscalating || isFirstLoad) {
        const alert = createAlert({
          district: district.districtName,
          riskLevel: currentLevel,
          score: district.score,
          type: isEscalating ? 'ESCALATION' : 'INITIAL',
        });

        newAlerts.push(alert);

        if (alert.sentToOfficials) {
          newSms.push({
            id: `SMS-OFF-${alert.id}`,
            alertId: alert.id,
            recipient: 'District Collector & Emergency Team',
            phone: '+91-94XXXXXXXX',
            message: alert.officialSMS,
            sentAt: alert.timestamp,
            district: district.districtName,
            type: 'OFFICIAL',
          });
        }

        if (alert.sentToResidents && alert.residentSMS) {
          newSms.push({
            id: `SMS-RES-${alert.id}`,
            alertId: alert.id,
            recipient: `All Residents — ${district.districtName}`,
            phone: 'BULK-SMS',
            message: alert.residentSMS,
            sentAt: alert.timestamp,
            district: district.districtName,
            type: 'RESIDENT',
          });
        }

        prevRisksRef.current[district.districtId] = currentLevel;
      } else if (!prevLevel) {
        prevRisksRef.current[district.districtId] = currentLevel;
      }
    });

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev].slice(0, 100)); // Keep last 100
      setSmsQueue(prev => [...newSms, ...prev].slice(0, 50));
    }
  }, [districtRisks]);

  const acknowledgeAlert = (alertId) => {
    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, acknowledged: true } : a));
  };

  const clearAlerts = () => {
    setAlerts([]);
    setSmsQueue([]);
  };

  return { alerts, smsQueue, acknowledgeAlert, clearAlerts };
}