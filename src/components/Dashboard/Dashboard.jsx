// src/components/Dashboard/Dashboard.jsx
import React, { useState } from 'react';
import {
  LayoutDashboard, Map, Bell, MessageSquare,
  Droplets, Waves, Mountain, TrendingUp,
  AlertTriangle, CheckCircle, XCircle, AlertOctagon,
  Activity, Database
} from 'lucide-react';
import RiskMap from '../Map/RiskMap';
import RiskScoreCard from '../RiskScore/RiskScoreCard';
import AlertPanel from '../AlertPanel/AlertPanel';
import SMSSimulator from '../SMSSimulator/SMSSimulator';
import ForecastChart from '../ForecastChart/ForecastChart';
import './Dashboard.css';

function StatCard({ icon: Icon, label, value, subValue, color, onClick, active }) {
  return (
    <div
      className={`stat-card ${active ? 'active' : ''}`}
      style={{ '--stat-color': color }}
      onClick={onClick}
    >
      <div className="stat-icon" style={{ background: `${color}18`, color }}>
        <Icon size={18} />
      </div>
      <div className="stat-content">
        <div className="stat-value" style={{ color }}>{value}</div>
        <div className="stat-label">{label}</div>
        {subValue && <div className="stat-sub">{subValue}</div>}
      </div>
    </div>
  );
}

function MetricBar({ label, value, max = 100, color }) {
  return (
    <div className="metric-bar-row">
      <span className="metric-label">{label}</span>
      <div className="metric-track">
        <div className="metric-fill" style={{ width: `${(value / max) * 100}%`, background: color }} />
      </div>
      <span className="metric-val">{value}</span>
    </div>
  );
}

const VIEWS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'map', label: 'Risk Map', icon: Map },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'sms', label: 'SMS', icon: MessageSquare },
];

export default function Dashboard({ districtRisks, summary, alerts, smsQueue, onAcknowledge, onClear, loading }) {
  const [activeView, setActiveView] = useState('overview');
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  const sortedDistricts = [...districtRisks].sort((a, b) => b.score - a.score);

  const handleSelectDistrict = (district) => {
    setSelectedDistrict(prev => prev?.districtId === district.districtId ? null : district);
  };

  return (
    <div className="dashboard">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <nav className="sidebar-nav">
          {VIEWS.map(v => (
            <button
              key={v.id}
              className={`nav-item ${activeView === v.id ? 'active' : ''}`}
              onClick={() => setActiveView(v.id)}
              title={v.label}
            >
              <v.icon size={18} />
              <span>{v.label}</span>
            </button>
          ))}
        </nav>

        {/* Sidebar Stats */}
        <div className="sidebar-stats">
          <div className="sidebar-stat critical">
            <XCircle size={13} />
            <span>{summary.critical} Critical</span>
          </div>
          <div className="sidebar-stat high">
            <AlertOctagon size={13} />
            <span>{summary.high} High</span>
          </div>
          <div className="sidebar-stat moderate">
            <AlertTriangle size={13} />
            <span>{summary.moderate} Moderate</span>
          </div>
          <div className="sidebar-stat low">
            <CheckCircle size={13} />
            <span>{summary.low} Low</span>
          </div>
        </div>

        {/* Data Source Badge */}
        <div className="sidebar-source">
          <Database size={11} />
          <span>Demo Mode — Mock Data Active</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">

        {/* ── OVERVIEW VIEW ── */}
        {activeView === 'overview' && (
          <div className="view-overview">
            {/* Top Stats Row */}
            <div className="stats-row">
              <StatCard icon={Activity} label="Max Risk Score" value={summary.maxScore}
                subValue="Highest district" color="#ef4444" />
              <StatCard icon={TrendingUp} label="Avg Risk Score" value={summary.avgScore}
                subValue="All districts" color="#f59e0b" />
              <StatCard icon={Waves} label="Districts Monitored" value={summary.total}
                subValue="Tamil Nadu" color="#3b82f6" />
              <StatCard icon={Bell} label="Active Alerts" value={alerts.filter(a => !a.acknowledged).length}
                subValue="Unacknowledged" color="#a855f7"
                onClick={() => setActiveView('alerts')} />
            </div>

            {/* Two-column layout */}
            <div className="overview-grid">
              {/* Left: District Cards */}
              <div className="district-cards-col">
                <div className="col-header">
                  <span>District Risk Scores</span>
                  <span className="col-sub">Sorted by severity</span>
                </div>
                <div className="district-cards-list">
                  {loading && districtRisks.length === 0 ? (
                    Array(6).fill(0).map((_, i) => (
                      <div key={i} className="card-skeleton" />
                    ))
                  ) : (
                    sortedDistricts.map(d => (
                      <RiskScoreCard
                        key={d.districtId}
                        district={d}
                        onSelect={handleSelectDistrict}
                        isSelected={selectedDistrict?.districtId === d.districtId}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* Right: Forecast + Detail */}
              <div className="right-col">
                {/* Forecast Chart */}
                <div className="forecast-section">
                  <ForecastChart district={selectedDistrict} />
                </div>

                {/* District Detail Panel */}
                {selectedDistrict ? (
                  <div className="district-detail">
                    <div className="detail-header">
                      <span className="detail-title">{selectedDistrict.districtName} — Detail</span>
                      <button className="close-detail" onClick={() => setSelectedDistrict(null)}>✕</button>
                    </div>

                    <div className="detail-metrics">
                      <MetricBar label="Rainfall" value={selectedDistrict.breakdown?.rainfall?.score || 0} color="#38bdf8" />
                      <MetricBar label="River Level" value={selectedDistrict.breakdown?.riverLevel?.score || 0} color="#818cf8" />
                      <MetricBar label="Elevation Risk" value={selectedDistrict.breakdown?.elevation?.score || 0} color="#fb923c" />
                      <MetricBar label="Historical" value={selectedDistrict.breakdown?.historical?.score || 0} color="#f472b6" />
                    </div>

                    <div className="detail-info-grid">
                      <div className="info-cell">
                        <Droplets size={12} />
                        <span>{selectedDistrict.weather?.rainfall?.toFixed(1)} mm/hr</span>
                        <label>Rainfall</label>
                      </div>
                      <div className="info-cell">
                        <Waves size={12} />
                        <span>{selectedDistrict.river?.level?.toFixed(0)}%</span>
                        <label>{selectedDistrict.river?.riverName}</label>
                      </div>
                      <div className="info-cell">
                        <Mountain size={12} />
                        <span>{selectedDistrict.elevation?.elevation}m</span>
                        <label>Elevation</label>
                      </div>
                      <div className="info-cell">
                        <Activity size={12} />
                        <span>{selectedDistrict.historicalCount}</span>
                        <label>Past Events</label>
                      </div>
                    </div>

                    <div className="detail-river-status">
                      <span>River Status:</span>
                      <span className={`river-status-text ${selectedDistrict.river?.status?.toLowerCase().replace(' ', '-') || 'normal'}`}>
                        {selectedDistrict.river?.status}
                      </span>
                      <span>({selectedDistrict.river?.currentM?.toFixed(2)}m / {selectedDistrict.river?.maxLevel}m)</span>
                    </div>
                  </div>
                ) : (
                  <div className="detail-placeholder">
                    <LayoutDashboard size={28} />
                    <p>Click any district card to see detailed analysis</p>
                  </div>
                )}

                {/* Calibration Panel */}
                <div className="calibration-panel">
                  <div className="col-header">
                    <span>System Metrics</span>
                  </div>
                  <div className="calibration-metrics">
                    <div className="cal-row">
                      <span>Geographic Precision</span>
                      <span className="cal-val green">94.2%</span>
                    </div>
                    <div className="cal-row">
                      <span>Avg Alert Lead Time</span>
                      <span className="cal-val blue">18–24 hrs</span>
                    </div>
                    <div className="cal-row">
                      <span>Score Calibration (10yr)</span>
                      <span className="cal-val amber">87.6%</span>
                    </div>
                    <div className="cal-row">
                      <span>Dashboard Latency</span>
                      <span className="cal-val green">&lt; 2s</span>
                    </div>
                    <div className="cal-row">
                      <span>Districts Online</span>
                      <span className="cal-val green">{summary.total}/15</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── MAP VIEW ── */}
        {activeView === 'map' && (
          <div className="view-map">
            <div className="map-container">
              <RiskMap
                districtRisks={districtRisks}
                selectedDistrict={selectedDistrict}
                onSelectDistrict={handleSelectDistrict}
              />
            </div>
            {selectedDistrict && (
              <div className="map-detail-sidebar">
                <ForecastChart district={selectedDistrict} />
              </div>
            )}
          </div>
        )}

        {/* ── ALERTS VIEW ── */}
        {activeView === 'alerts' && (
          <div className="view-alerts">
            <AlertPanel
              alerts={alerts}
              onAcknowledge={onAcknowledge}
              onClear={onClear}
            />
          </div>
        )}

        {/* ── SMS VIEW ── */}
        {activeView === 'sms' && (
          <div className="view-sms">
            <SMSSimulator smsQueue={smsQueue} districtRisks={districtRisks} />
          </div>
        )}
      </main>
    </div>
  );
}