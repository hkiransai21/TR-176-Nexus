// src/components/AlertPanel/AlertPanel.jsx
import React, { useState } from 'react';
import { Bell, BellOff, CheckCircle, AlertTriangle, AlertOctagon, XCircle, Filter, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import './AlertPanel.css';

const RISK_ICONS = {
  LOW: null,
  MODERATE: <AlertTriangle size={14} />,
  HIGH: <AlertOctagon size={14} />,
  CRITICAL: <XCircle size={14} />,
};

const RISK_COLORS = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#a855f7',
};

function AlertItem({ alert, onAcknowledge }) {
  const [expanded, setExpanded] = useState(false);
  const color = RISK_COLORS[alert.riskLevel];
  const icon = RISK_ICONS[alert.riskLevel];

  return (
    <div
      className={`alert-item ${alert.riskLevel.toLowerCase()} ${alert.acknowledged ? 'acked' : ''}`}
      style={{ '--alert-color': color }}
    >
      <div className="alert-item-header" onClick={() => setExpanded(e => !e)}>
        <div className="alert-left">
          <span className="alert-icon" style={{ color }}>
            {icon || <Bell size={14} />}
          </span>
          <div className="alert-meta">
            <span className="alert-district">{alert.district}</span>
            <span className="alert-time">
              {format(new Date(alert.timestamp), 'HH:mm:ss')} · {alert.id}
            </span>
          </div>
        </div>
        <div className="alert-right">
          <span className="alert-score" style={{ color }}>{alert.score}/100</span>
          <span className="alert-level-badge" style={{ background: `${color}22`, color }}>
            {alert.riskLevel}
          </span>
          {!alert.acknowledged && (
            <button
              className="ack-btn"
              title="Acknowledge"
              onClick={e => { e.stopPropagation(); onAcknowledge(alert.id); }}
            >
              <CheckCircle size={14} />
            </button>
          )}
          {alert.acknowledged && (
            <span className="acked-badge"><CheckCircle size={11} /> ACK</span>
          )}
        </div>
      </div>

      {expanded && (
        <div className="alert-expanded">
          <div className="expanded-section">
            <span className="section-label">📋 Official Advisory</span>
            <p className="sms-text official">{alert.officialSMS}</p>
          </div>
          {alert.residentSMS && (
            <div className="expanded-section">
              <span className="section-label">📢 Resident Alert</span>
              <p className="sms-text resident">{alert.residentSMS}</p>
            </div>
          )}
          <div className="expanded-meta">
            <span>Type: <strong>{alert.type}</strong></span>
            <span>Officials Notified: <strong>{alert.sentToOfficials ? 'YES' : 'NO'}</strong></span>
            <span>Residents Notified: <strong>{alert.sentToResidents ? 'YES' : 'NO'}</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AlertPanel({ alerts, onAcknowledge, onClear }) {
  const [filter, setFilter] = useState('ALL');
  const [showUnackedOnly, setShowUnackedOnly] = useState(false);

  const filtered = alerts.filter(a => {
    if (filter !== 'ALL' && a.riskLevel !== filter) return false;
    if (showUnackedOnly && a.acknowledged) return false;
    return true;
  });

  const counts = {
    CRITICAL: alerts.filter(a => a.riskLevel === 'CRITICAL').length,
    HIGH: alerts.filter(a => a.riskLevel === 'HIGH').length,
    MODERATE: alerts.filter(a => a.riskLevel === 'MODERATE').length,
    unacked: alerts.filter(a => !a.acknowledged).length,
  };

  return (
    <div className="alert-panel">
      {/* Panel Header */}
      <div className="alert-panel-header">
        <div className="panel-title">
          <Bell size={16} />
          <span>Alert Feed</span>
          {counts.unacked > 0 && (
            <span className="unacked-count">{counts.unacked}</span>
          )}
        </div>
        <div className="panel-actions">
          <button
            className={`unacked-toggle ${showUnackedOnly ? 'active' : ''}`}
            onClick={() => setShowUnackedOnly(v => !v)}
            title="Show unacknowledged only"
          >
            <BellOff size={13} />
          </button>
          <button className="clear-btn" onClick={onClear} title="Clear all alerts">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="alert-summary-bar">
        <div className="summary-chip critical" onClick={() => setFilter(f => f === 'CRITICAL' ? 'ALL' : 'CRITICAL')}>
          <XCircle size={12} />
          <span>{counts.CRITICAL} Critical</span>
        </div>
        <div className="summary-chip high" onClick={() => setFilter(f => f === 'HIGH' ? 'ALL' : 'HIGH')}>
          <AlertOctagon size={12} />
          <span>{counts.HIGH} High</span>
        </div>
        <div className="summary-chip moderate" onClick={() => setFilter(f => f === 'MODERATE' ? 'ALL' : 'MODERATE')}>
          <AlertTriangle size={12} />
          <span>{counts.MODERATE} Moderate</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        <Filter size={12} style={{ color: 'var(--text-muted)' }} />
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map(f => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? 'active' : ''} ${f.toLowerCase()}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Alert List */}
      <div className="alert-list">
        {filtered.length === 0 ? (
          <div className="alert-empty">
            <CheckCircle size={28} style={{ color: '#22c55e' }} />
            <p>No alerts match current filters</p>
            <span>All systems nominal</span>
          </div>
        ) : (
          filtered.map(alert => (
            <AlertItem key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
          ))
        )}
      </div>
    </div>
  );
}