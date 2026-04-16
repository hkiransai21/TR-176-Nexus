// src/components/Navbar/Navbar.jsx
import React from 'react';
import { format } from 'date-fns';
import { Waves, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ lastRefresh, refreshCount, avgLatency, onRefresh, loading }) {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <div className="navbar-icon">
          <Waves size={22} />
        </div>
        <div className="navbar-title">
          <span className="navbar-main-title">FloodWatch TN</span>
          <span className="navbar-subtitle">Hyperlocal Flood Risk Platform</span>
        </div>
      </div>

      <div className="navbar-center">
        <div className="status-badge live">
          <span className="pulse-dot"></span>
          LIVE MONITORING
        </div>
      </div>

      <div className="navbar-meta">
        <div className="meta-item">
          {avgLatency > 0 ? <Wifi size={14} /> : <WifiOff size={14} />}
          <span>{avgLatency > 0 ? `${avgLatency}ms` : '---'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Updated:</span>
          <span>{lastRefresh ? format(lastRefresh, 'HH:mm:ss') : '---'}</span>
        </div>
        <div className="meta-item">
          <span className="meta-label">Cycle:</span>
          <span>#{refreshCount}</span>
        </div>
        <button className={`refresh-btn ${loading ? 'spinning' : ''}`} onClick={onRefresh} disabled={loading}>
          <RefreshCw size={15} />
        </button>
      </div>
    </nav>
  );
}