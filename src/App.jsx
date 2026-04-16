// src/App.jsx
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import { useFloodData } from './hooks/useFloodData';
import { useAlerts } from './hooks/useAlerts';
import './App.css';

export default function App() {
  const { districtRisks, loading, error, lastRefresh, refreshCount, avgLatency, summary, refresh } = useFloodData();
  const { alerts, smsQueue, acknowledgeAlert, clearAlerts } = useAlerts(districtRisks);

  return (
    <div className="app">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#e2e8f0',
            border: '1px solid #334155',
            borderRadius: '10px',
            fontSize: '13px',
          },
        }}
      />

      <Navbar
        lastRefresh={lastRefresh}
        refreshCount={refreshCount}
        avgLatency={avgLatency}
        onRefresh={refresh}
        loading={loading}
      />

      {error && (
        <div className="error-banner">
          ⚠ Data fetch error: {error} — Retrying automatically...
        </div>
      )}

      <Dashboard
        districtRisks={districtRisks}
        summary={summary}
        alerts={alerts}
        smsQueue={smsQueue}
        onAcknowledge={acknowledgeAlert}
        onClear={clearAlerts}
        loading={loading}
      />
    </div>
  );
}