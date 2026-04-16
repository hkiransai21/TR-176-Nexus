// src/components/Map/RiskMap.jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './RiskMap.css';

const RISK_COLORS = {
  LOW: '#22c55e',
  MODERATE: '#f59e0b',
  HIGH: '#ef4444',
  CRITICAL: '#a855f7',
};

function getRiskRadius(score) {
  return 12 + (score / 100) * 24;
}

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function RiskMap({ districtRisks, selectedDistrict, onSelectDistrict }) {
  const tamilNaduCenter = [10.5, 78.5];

  return (
    <div className="risk-map-wrapper">
      <div className="map-legend">
        {Object.entries(RISK_COLORS).map(([level, color]) => (
          <div key={level} className="legend-item">
            <span className="legend-dot" style={{ background: color }}></span>
            <span>{level}</span>
          </div>
        ))}
      </div>

      <MapContainer
        center={tamilNaduCenter}
        zoom={7}
        className="leaflet-map"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {selectedDistrict && (
          <MapUpdater center={[selectedDistrict.lat, selectedDistrict.lon]} />
        )}

        {districtRisks.map(district => {
          const color = RISK_COLORS[district.riskLevel] || '#22c55e';
          const isSelected = selectedDistrict?.districtId === district.districtId;

          return (
            <CircleMarker
              key={district.districtId}
              center={[district.lat, district.lon]}
              radius={isSelected ? getRiskRadius(district.score) + 5 : getRiskRadius(district.score)}
              pathOptions={{
                fillColor: color,
                fillOpacity: isSelected ? 0.85 : 0.65,
                color: isSelected ? 'white' : color,
                weight: isSelected ? 2.5 : 1,
              }}
              eventHandlers={{
                click: () => onSelectDistrict(district),
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} permanent={false}>
                <div className="map-tooltip">
                  <strong>{district.districtName}</strong>
                  <span style={{ color }}>{district.riskLevel} — {district.score}/100</span>
                  <span>Rain: {district.weather?.rainfall?.toFixed(1)}mm/hr</span>
                  <span>River: {district.river?.level?.toFixed(0)}% capacity</span>
                </div>
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}