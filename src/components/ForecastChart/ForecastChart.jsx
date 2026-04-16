// src/components/ForecastChart/ForecastChart.jsx
import React, { useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, ResponsiveContainer, Legend
} from 'recharts';
import { TrendingUp, Clock } from 'lucide-react';
import './ForecastChart.css';

const RISK_COLORS = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#a855f7',
};

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  const score = payload[0]?.value;
  const rainfall = payload[1]?.value;
  const level = score <= 25 ? 'LOW' : score <= 50 ? 'MODERATE' : score <= 75 ? 'HIGH' : 'CRITICAL';

  return (
    <div className="chart-tooltip">
      <div className="tooltip-time"><Clock size={11} /> {label}</div>
      <div className="tooltip-row">
        <span>Risk Score</span>
        <span style={{ color: RISK_COLORS[level] }}>{score} — {level}</span>
      </div>
      {rainfall !== undefined && (
        <div className="tooltip-row">
          <span>Rainfall</span>
          <span>{rainfall?.toFixed(1)} mm/hr</span>
        </div>
      )}
    </div>
  );
}

function getGradientColor(score) {
  if (score <= 25) return '#22c55e';
  if (score <= 50) return '#f59e0b';
  if (score <= 75) return '#ef4444';
  return '#a855f7';
}

export default function ForecastChart({ district }) {
  const [view, setView] = useState('24h');

  if (!district?.forecastTrend?.length) {
    return (
      <div className="forecast-empty">
        <TrendingUp size={32} />
        <p>Select a district to view forecast</p>
      </div>
    );
  }

  const allPoints = district.forecastTrend;
  const pointCount = view === '24h' ? 8 : view === '48h' ? 16 : 24;
  const data = allPoints.slice(0, pointCount).map((p, i) => ({
    label: p.label,
    score: p.score,
    rainfall: district.forecastTrend[i]?.rainfall || 0,
    riskLevel: p.riskLevel,
  }));

  const peakScore = Math.max(...data.map(d => d.score));
  const peakPoint = data.find(d => d.score === peakScore);
  const dominantColor = getGradientColor(peakScore);

  return (
    <div className="forecast-chart-wrapper">
      <div className="forecast-header">
        <div className="forecast-title">
          <TrendingUp size={16} />
          <span>72-Hour Risk Forecast — <strong>{district.districtName}</strong></span>
        </div>
        <div className="view-toggle">
          {['24h', '48h', '72h'].map(v => (
            <button
              key={v}
              className={`toggle-btn ${view === v ? 'active' : ''}`}
              onClick={() => setView(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div className="forecast-peak-info">
        <span>Peak Score:</span>
        <span style={{ color: dominantColor }}>{peakScore}/100</span>
        <span>at {peakPoint?.label}</span>
        <span className="peak-badge" style={{ background: `${dominantColor}22`, color: dominantColor }}>
          {peakPoint?.riskLevel}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={dominantColor} stopOpacity={0.35} />
              <stop offset="95%" stopColor={dominantColor} stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="rainGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />

          {/* Threshold reference lines */}
          <ReferenceLine y={25} stroke="#22c55e" strokeDasharray="4 4" strokeOpacity={0.4}
            label={{ value: 'LOW', fill: '#22c55e', fontSize: 10, position: 'insideTopRight' }} />
          <ReferenceLine y={50} stroke="#f59e0b" strokeDasharray="4 4" strokeOpacity={0.4}
            label={{ value: 'MOD', fill: '#f59e0b', fontSize: 10, position: 'insideTopRight' }} />
          <ReferenceLine y={75} stroke="#ef4444" strokeDasharray="4 4" strokeOpacity={0.4}
            label={{ value: 'HIGH', fill: '#ef4444', fontSize: 10, position: 'insideTopRight' }} />

          <Tooltip content={<CustomTooltip />} />

          <Area
            type="monotone"
            dataKey="rainfall"
            stroke="#38bdf8"
            strokeWidth={1.5}
            fill="url(#rainGradient)"
            name="Rainfall (mm/hr)"
            dot={false}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke={dominantColor}
            strokeWidth={2.5}
            fill="url(#riskGradient)"
            name="Risk Score"
            dot={false}
            activeDot={{ r: 5, fill: dominantColor }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-legend-row">
        <span className="legend-chip risk">— Risk Score (0–100)</span>
        <span className="legend-chip rain">— Rainfall (mm/hr)</span>
      </div>
    </div>
  );
}