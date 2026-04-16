// src/components/RiskScore/RiskScoreCard.jsx
import React from 'react';
import { Droplets, Waves, Mountain, History } from 'lucide-react';
import './RiskScoreCard.css';

function ScoreRing({ score, riskLevel, color }) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="score-ring-container">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle
          cx="65" cy="65" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 65 65)"
          style={{ transition: 'stroke-dashoffset 1s ease, stroke 0.5s ease' }}
        />
      </svg>
      <div className="score-ring-text">
        <span className="score-number" style={{ color }}>{score}</span>
        <span className="score-label">/100</span>
      </div>
    </div>
  );
}

function BreakdownBar({ label, icon: Icon, value, score, color }) {
  return (
    <div className="breakdown-row">
      <div className="breakdown-label">
        <Icon size={13} />
        <span>{label}</span>
      </div>
      <div className="breakdown-bar-track">
        <div
          className="breakdown-bar-fill"
          style={{ width: `${score}%`, background: color }}
        />
      </div>
      <span className="breakdown-val">{score}</span>
    </div>
  );
}

export default function RiskScoreCard({ district, onSelect, isSelected }) {
  if (!district) return null;
  const { score, riskLevel, riskConfig, districtName, weather, river, breakdown } = district;

  return (
    <div
      className={`risk-card ${riskLevel.toLowerCase()} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(district)}
      style={{ '--risk-color': riskConfig.color }}
    >
      <div className="risk-card-header">
        <div>
          <div className="risk-district-name">{districtName}</div>
          <div className="risk-pincode">{district.pincode}</div>
        </div>
        <span className="risk-badge" style={{ background: riskConfig.bg, color: riskConfig.color }}>
          {riskLevel}
        </span>
      </div>

      <div className="risk-card-body">
        <ScoreRing score={score} riskLevel={riskLevel} color={riskConfig.color} />

        <div className="risk-quick-stats">
          <div className="quick-stat">
            <Droplets size={13} />
            <span>{weather?.rainfall?.toFixed(1) || 0} mm/hr</span>
          </div>
          <div className="quick-stat">
            <Waves size={13} />
            <span>{river?.level?.toFixed(0) || 0}% capacity</span>
          </div>
          <div className="quick-stat river-name">
            {river?.riverName || 'River'}
            <span className={`river-status-dot ${river?.status?.toLowerCase().replace(' ', '-') || 'normal'}`}></span>
          </div>
        </div>
      </div>

      {breakdown && (
        <div className="risk-breakdown">
          <BreakdownBar label="Rainfall" icon={Droplets} score={breakdown.rainfall.score} color={riskConfig.color} />
          <BreakdownBar label="River Lvl" icon={Waves} score={breakdown.riverLevel.score} color={riskConfig.color} />
          <BreakdownBar label="Elevation" icon={Mountain} score={breakdown.elevation.score} color={riskConfig.color} />
          <BreakdownBar label="Historical" icon={History} score={breakdown.historical.score} color={riskConfig.color} />
        </div>
      )}
    </div>
  );
}