// src/components/SMSSimulator/SMSSimulator.jsx
import React, { useState } from 'react';
import { MessageSquare, Send, Users, Shield, Clock, CheckCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { format } from 'date-fns';
import './SMSSimulator.css';

const TYPE_CONFIG = {
  OFFICIAL: {
    label: 'Official / DM',
    icon: <Shield size={13} />,
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    border: 'rgba(59,130,246,0.25)',
  },
  RESIDENT: {
    label: 'Residents',
    icon: <Users size={13} />,
    color: '#f59e0b',
    bg: 'rgba(245,158,11,0.1)',
    border: 'rgba(245,158,11,0.25)',
  },
};

const RISK_COLORS = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#a855f7',
};

function SMSBubble({ sms }) {
  const [expanded, setExpanded] = useState(false);
  const config = TYPE_CONFIG[sms.type] || TYPE_CONFIG.OFFICIAL;
  const riskColor = RISK_COLORS[sms.riskLevel] || '#64748b';

  const preview = sms.message.length > 90 && !expanded
    ? sms.message.slice(0, 90) + '...'
    : sms.message;

  return (
    <div className="sms-bubble" style={{ '--sms-color': config.color, '--sms-bg': config.bg, '--sms-border': config.border }}>
      {/* Header */}
      <div className="sms-header">
        <div className="sms-recipient-info">
          <span className="sms-type-icon" style={{ color: config.color }}>{config.icon}</span>
          <div className="sms-recipient-text">
            <span className="sms-to">TO: {sms.recipient}</span>
            <span className="sms-phone">{sms.phone}</span>
          </div>
        </div>
        <div className="sms-header-right">
          <span className="sms-district-tag" style={{ color: riskColor, background: `${riskColor}15` }}>
            {sms.district}
          </span>
          <span className="sms-type-tag" style={{ color: config.color, background: config.bg }}>
            {config.label}
          </span>
        </div>
      </div>

      {/* Message Body */}
      <div className="sms-body">
        <div className="sms-phone-mock">
          <div className="phone-screen">
            <div className="phone-header-bar">
              <span className="phone-sender">TN-FloodAlert</span>
              <span className="phone-time">{format(new Date(sms.sentAt), 'HH:mm')}</span>
            </div>
            <div className="phone-message-bubble">
              <p>{preview}</p>
              {sms.message.length > 90 && (
                <button className="expand-msg-btn" onClick={() => setExpanded(e => !e)}>
                  {expanded ? <><ChevronUp size={11} /> Show less</> : <><ChevronDown size={11} /> Show full message</>}
                </button>
              )}
            </div>
            <div className="phone-status">
              <CheckCheck size={13} className="delivered-icon" />
              <span>Delivered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="sms-footer">
        <span className="sms-id">{sms.id}</span>
        <span className="sms-timestamp">
          <Clock size={10} />
          {format(new Date(sms.sentAt), 'HH:mm:ss dd MMM')}
        </span>
      </div>
    </div>
  );
}

function ComposeSimulator({ districtRisks }) {
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [messageType, setMessageType] = useState('OFFICIAL');
  const [customMsg, setCustomMsg] = useState('');
  const [sent, setSent] = useState(false);

  const district = districtRisks.find(d => d.districtId === selectedDistrict);

  const handleSend = () => {
    if (!customMsg.trim() || !selectedDistrict) return;
    setSent(true);
    setTimeout(() => setSent(false), 2500);
    setCustomMsg('');
  };

  const charCount = customMsg.length;
  const smsPages = Math.ceil(charCount / 160) || 1;

  return (
    <div className="compose-panel">
      <div className="compose-title">
        <Send size={13} />
        <span>Compose Alert</span>
      </div>

      <div className="compose-row">
        <label>District</label>
        <select
          className="compose-select"
          value={selectedDistrict}
          onChange={e => setSelectedDistrict(e.target.value)}
        >
          <option value="">— Select District —</option>
          {districtRisks.map(d => (
            <option key={d.districtId} value={d.districtId}>
              {d.districtName} [{d.riskLevel} · {d.score}]
            </option>
          ))}
        </select>
      </div>

      <div className="compose-row">
        <label>Recipient Type</label>
        <div className="type-selector">
          {['OFFICIAL', 'RESIDENT'].map(t => (
            <button
              key={t}
              className={`type-btn ${messageType === t ? 'active' : ''}`}
              onClick={() => setMessageType(t)}
              style={messageType === t ? { '--active-color': TYPE_CONFIG[t].color } : {}}
            >
              {TYPE_CONFIG[t].icon}
              {TYPE_CONFIG[t].label}
            </button>
          ))}
        </div>
      </div>

      <div className="compose-row">
        <label>Message</label>
        <textarea
          className="compose-textarea"
          placeholder="Type emergency message..."
          value={customMsg}
          onChange={e => setCustomMsg(e.target.value)}
          rows={4}
          maxLength={480}
        />
        <div className="char-info">
          <span className={charCount > 160 ? 'over-limit' : ''}>{charCount}/160</span>
          <span>{smsPages} SMS page{smsPages > 1 ? 's' : ''}</span>
        </div>
      </div>

      {district && (
        <div className="compose-preview-meta">
          <span>Risk: <strong style={{ color: RISK_COLORS[district.riskLevel] }}>{district.riskLevel} ({district.score}/100)</strong></span>
          <span>River: <strong>{district.river?.level?.toFixed(0)}% capacity</strong></span>
        </div>
      )}

      <button
        className={`send-btn ${sent ? 'sent' : ''}`}
        onClick={handleSend}
        disabled={!selectedDistrict || !customMsg.trim()}
      >
        {sent ? <><CheckCheck size={15} /> Sent!</> : <><Send size={15} /> Send Alert</>}
      </button>
    </div>
  );
}

export default function SMSSimulator({ smsQueue, districtRisks }) {
  const [tab, setTab] = useState('FEED');
  const [filter, setFilter] = useState('ALL');

  const filtered = smsQueue.filter(s => filter === 'ALL' || s.type === filter);

  return (
    <div className="sms-simulator">
      {/* Header */}
      <div className="sms-sim-header">
        <div className="sim-title">
          <MessageSquare size={16} />
          <span>SMS Simulator</span>
          <span className="sms-queue-count">{smsQueue.length}</span>
        </div>
        <div className="sim-tabs">
          <button className={`sim-tab ${tab === 'FEED' ? 'active' : ''}`} onClick={() => setTab('FEED')}>Feed</button>
          <button className={`sim-tab ${tab === 'COMPOSE' ? 'active' : ''}`} onClick={() => setTab('COMPOSE')}>Compose</button>
        </div>
      </div>

      {tab === 'FEED' ? (
        <>
          {/* Filter Row */}
          <div className="sms-filter-row">
            {['ALL', 'OFFICIAL', 'RESIDENT'].map(f => (
              <button
                key={f}
                className={`sms-filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'ALL' ? `All (${smsQueue.length})` :
                  f === 'OFFICIAL' ? `Officials (${smsQueue.filter(s => s.type === 'OFFICIAL').length})` :
                  `Residents (${smsQueue.filter(s => s.type === 'RESIDENT').length})`}
              </button>
            ))}
          </div>

          {/* SMS Feed */}
          <div className="sms-feed">
            {filtered.length === 0 ? (
              <div className="sms-empty">
                <MessageSquare size={28} />
                <p>No SMS alerts sent yet</p>
                <span>Alerts trigger when risk ≥ MODERATE</span>
              </div>
            ) : (
              filtered.map(sms => <SMSBubble key={sms.id} sms={sms} />)
            )}
          </div>
        </>
      ) : (
        <div className="compose-wrapper">
          <ComposeSimulator districtRisks={districtRisks} />
        </div>
      )}
    </div>
  );
}