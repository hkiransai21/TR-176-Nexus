// src/hooks/useFloodData.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { assessAllDistricts } from '../services/riskEngine';
import { DISTRICTS, UPDATE_INTERVAL } from '../utils/constants';

export function useFloodData() {
  const [districtRisks, setDistrictRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);
  const [refreshCount, setRefreshCount] = useState(0);
  const [avgLatency, setAvgLatency] = useState(0);
  const intervalRef = useRef(null);

  const fetchData = useCallback(async () => {
    try {
      const startTime = Date.now();
      const results = await assessAllDistricts(DISTRICTS);
      const totalLatency = Date.now() - startTime;

      setDistrictRisks(results);
      setLastRefresh(new Date());
      setRefreshCount(c => c + 1);
      setAvgLatency(totalLatency);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Failed to fetch flood data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh polling
  useEffect(() => {
    intervalRef.current = setInterval(fetchData, UPDATE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchData]);

  // Summary stats derived from current data
  const summary = {
    total: districtRisks.length,
    critical: districtRisks.filter(d => d.riskLevel === 'CRITICAL').length,
    high: districtRisks.filter(d => d.riskLevel === 'HIGH').length,
    moderate: districtRisks.filter(d => d.riskLevel === 'MODERATE').length,
    low: districtRisks.filter(d => d.riskLevel === 'LOW').length,
    maxScore: districtRisks.length ? Math.max(...districtRisks.map(d => d.score)) : 0,
    avgScore: districtRisks.length
      ? Math.round(districtRisks.reduce((a, b) => a + b.score, 0) / districtRisks.length)
      : 0,
  };

  return {
    districtRisks,
    loading,
    error,
    lastRefresh,
    refreshCount,
    avgLatency,
    summary,
    refresh: fetchData,
  };
}