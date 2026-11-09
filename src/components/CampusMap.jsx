import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  Bus, 
  MapPin, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Info, 
  Clock, 
  Users, 
  Check, 
  ArrowRight,
  Shield,
  Wifi,
  Bike
} from 'lucide-react';

export default function CampusMap() {
  const { 
    routes, 
    stops, 
    buses, 
    selectedRouteId, 
    setSelectedRouteId,
    selectedBusId, 
    setSelectedBusId,
    selectedStopId,
    setSelectedStopId,
    notify
  } = useTransport();

  const [zoomLevel, setZoomLevel] = useState(1);
  const [activeStopPopup, setActiveStopPopup] = useState(null);

  // Compute animated or interpolated position for a bus
  const getBusCoordinates = (bus) => {
    const cur = stops.find(s => s.id === bus.currentStopId);
    const nxt = stops.find(s => s.id === bus.nextStopId);
    if (!cur || !nxt) return { x: 500, y: 250 };

    const fraction = (bus.progress || 0) / 100;
    const x = cur.x + (nxt.x - cur.x) * fraction;
    const y = cur.y + (nxt.y - cur.y) * fraction;
    return { x, y };
  };

  const filteredBuses = buses.filter(b => selectedRouteId === 'all' || b.routeId === selectedRouteId);
  const filteredRoutes = routes.filter(r => selectedRouteId === 'all' || r.id === selectedRouteId);

  const selectedBus = buses.find(b => b.id === selectedBusId);
  const focusedStop = stops.find(s => s.id === (activeStopPopup || selectedStopId));

  // Next arrivals for selected stop
  const stopArrivals = focusedStop 
    ? buses.filter(b => {
        const route = routes.find(r => r.id === b.routeId);
        return route?.stops.includes(focusedStop.id);
      })
    : [];

  return (
    <div className="space-y-4">
      {/* Map Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Route Filter Selector */}
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-blue-500 shrink-0" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hidden sm:inline">
            Active Layer:
          </span>
          <select
            value={selectedRouteId}
            onChange={(e) => setSelectedRouteId(e.target.value)}
            className="text-xs font-semibold bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-1.5 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">🌐 All Campus Routes</option>
            {routes.map(r => (
              <option key={r.id} value={r.id}>
                {r.code} — {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status ticker */}
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-mono">{filteredBuses.length} shuttles moving in live view</span>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setZoomLevel(prev => Math.min(1.4, prev + 0.1))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(0.8, prev - 0.1))}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => { setZoomLevel(1); setSelectedBusId(null); setActiveStopPopup(null); }}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Map Container */}
      <div className="relative bg-slate-100 dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner min-h-[500px] flex items-center justify-center">
        
        {/* Subtle grid texture */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '24px 24px'
          }}
        />

        {/* SVG Interactive Canvas */}
        <div 
          className="w-full h-full overflow-auto flex items-center justify-center p-4 transition-transform duration-200"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg 
            viewBox="0 0 900 550" 
            className="w-full max-w-[900px] h-auto select-none transition-all drop-shadow-sm"
          >
            <defs>
              {/* Route line gradients */}
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#1D4ED8" />
              </linearGradient>

              {/* Shadow filter for buses */}
              <filter id="busShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Campus Background Schematic Zones */}
            <g id="campus-zones" opacity="0.6">
              {/* North Zone */}
              <rect x="220" y="40" width="460" height="110" rx="20" fill="#E2E8F0" className="dark:fill-slate-900/60" />
              <text x="240" y="60" fontSize="11" fontWeight="700" fill="#64748B" letterSpacing="1">NORTH TECH & LAB DISTRICT</text>

              {/* Central Core */}
              <rect x="280" y="200" width="350" height="120" rx="24" fill="#E2E8F0" className="dark:fill-slate-900/60" />
              <text x="300" y="222" fontSize="11" fontWeight="700" fill="#64748B" letterSpacing="1">CENTRAL QUAD & LIBRARY CORE</text>

              {/* West Quad */}
              <rect x="110" y="200" width="140" height="190" rx="18" fill="#E2E8F0" className="dark:fill-slate-900/60" />
              <text x="120" y="220" fontSize="10" fontWeight="700" fill="#64748B">WEST COMMERCE</text>

              {/* South Hostels */}
              <rect x="420" y="420" width="320" height="110" rx="20" fill="#E2E8F0" className="dark:fill-slate-900/60" />
              <text x="440" y="440" fontSize="11" fontWeight="700" fill="#64748B" letterSpacing="1">RESIDENTIAL HOSTELS VILLAGE</text>

              {/* Athletics */}
              <rect x="740" y="320" width="130" height="130" rx="18" fill="#E2E8F0" className="dark:fill-slate-900/60" />
              <text x="750" y="340" fontSize="10" fontWeight="700" fill="#64748B">SPORTS ARENA</text>
            </g>

            {/* Route Paths */}
            <g id="route-paths">
              {/* Blue Line: 1 -> 2 -> 3 -> 4 -> 5 */}
              {(selectedRouteId === 'all' || selectedRouteId === 'blue-line') && (
                <path
                  d="M 260 70 L 420 110 L 620 120 L 500 250 L 340 270 Z"
                  fill="none"
                  stroke="#2563EB"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="8 4"
                  className="transition-all opacity-85"
                />
              )}

              {/* Gold Line: 4 -> 6 -> 7 -> 8 -> 9 -> 4 */}
              {(selectedRouteId === 'all' || selectedRouteId === 'gold-line') && (
                <path
                  d="M 500 250 L 200 230 L 170 350 L 320 440 L 670 320 Z"
                  fill="none"
                  stroke="#D97706"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all opacity-85"
                />
              )}

              {/* Green Line: 10 -> 11 -> 12 -> 5 -> 8 -> 10 */}
              {(selectedRouteId === 'all' || selectedRouteId === 'green-line') && (
                <path
                  d="M 480 480 L 680 470 L 800 380 L 340 270 L 320 440 Z"
                  fill="none"
                  stroke="#059669"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-all opacity-85"
                />
              )}

              {/* Purple Line: 13 -> 1 -> 4 -> 14 */}
              {(selectedRouteId === 'all' || selectedRouteId === 'purple-line') && (
                <path
                  d="M 90 60 L 260 70 L 500 250 L 740 190"
                  fill="none"
                  stroke="#7C3AED"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6 4"
                  className="transition-all opacity-85"
                />
              )}

              {/* Night Owl: 4 -> 10 -> 11 -> 12 -> 3 */}
              {(selectedRouteId === 'all' || selectedRouteId === 'night-owl') && (
                <path
                  d="M 500 250 L 480 480 L 680 470 L 800 380 L 620 120 Z"
                  fill="none"
                  stroke="#E11D48"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="4 4"
                  className="transition-all opacity-70"
                />
              )}
            </g>

            {/* Stops Markers */}
            <g id="stops-layer">
              {stops.map(stop => {
                const isSelected = activeStopPopup === stop.id || selectedStopId === stop.id;
                return (
                  <g 
                    key={stop.id} 
                    className="cursor-pointer group"
                    onClick={() => {
                      setActiveStopPopup(stop.id);
                      setSelectedStopId(stop.id);
                    }}
                  >
                    {/* Outer glow ring */}
                    <circle
                      cx={stop.x}
                      cy={stop.y}
                      r={isSelected ? 16 : 10}
                      className={`transition-all duration-300 ${
                        isSelected 
                          ? 'fill-blue-500/20 stroke-blue-500 stroke-2 animate-pulse' 
                          : 'fill-white dark:fill-slate-800 stroke-slate-400 dark:stroke-slate-600 stroke-2 group-hover:stroke-blue-500'
                      }`}
                    />

                    {/* Center point */}
                    <circle
                      cx={stop.x}
                      cy={stop.y}
                      r={isSelected ? 7 : 5}
                      fill={isSelected ? '#2563EB' : '#475569'}
                      className="transition-all"
                    />

                    {/* Stop Label */}
                    <text
                      x={stop.x}
                      y={stop.y + 22}
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="600"
                      className="fill-slate-800 dark:fill-slate-200 pointer-events-none drop-shadow-xs"
                    >
                      {stop.name.split(' ')[0]} {stop.name.split(' ')[1] || ''}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Active Moving Buses Layer */}
            <g id="buses-layer">
              {filteredBuses.map(bus => {
                const coords = getBusCoordinates(bus);
                const route = routes.find(r => r.id === bus.routeId);
                const isBusSelected = selectedBusId === bus.id;

                return (
                  <g
                    key={bus.id}
                    transform={`translate(${coords.x}, ${coords.y})`}
                    className="cursor-pointer transition-all duration-500 ease-out"
                    onClick={() => {
                      setSelectedBusId(bus.id);
                      notify(`Tracking Shuttle ${bus.busNumber} (${route?.name})`, 'info');
                    }}
                    filter="url(#busShadow)"
                  >
                    {/* Highlight pulse for selected bus */}
                    {isBusSelected && (
                      <circle
                        cx="0"
                        cy="0"
                        r="22"
                        fill="none"
                        stroke={route?.color || '#2563EB'}
                        strokeWidth="3"
                        className="animate-ping"
                      />
                    )}

                    {/* Bus Body Pin */}
                    <circle
                      cx="0"
                      cy="0"
                      r="14"
                      fill={route?.color || '#2563EB'}
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />

                    {/* Bus Icon */}
                    <foreignObject x="-9" y="-9" width="18" height="18" className="pointer-events-none">
                      <div className="w-full h-full text-white flex items-center justify-center">
                        <Bus className="w-3.5 h-3.5" />
                      </div>
                    </foreignObject>

                    {/* Bus Label Badge */}
                    <rect
                      x="-22"
                      y="-26"
                      width="44"
                      height="15"
                      rx="4"
                      fill="#0F172A"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="-16"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="9"
                      fontWeight="700"
                      fontFamily="monospace"
                    >
                      {bus.busNumber}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Floating Stop Details Modal / Popup */}
        {focusedStop && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl z-20 transition-all animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  {focusedStop.zone}
                </span>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                  {focusedStop.name}
                </h4>
              </div>
              <button
                onClick={() => { setActiveStopPopup(null); setSelectedStopId(null); }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs p-1"
              >
                ✕
              </button>
            </div>

            {/* Amenities tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {focusedStop.amenities.map(item => (
                <span key={item} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                  {item}
                </span>
              ))}
            </div>

            {/* Live Incoming Shuttles at this stop */}
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
                <span>Incoming Shuttles</span>
                <Clock className="w-3 h-3 text-blue-500" />
              </div>

              {stopArrivals.length > 0 ? (
                stopArrivals.slice(0, 3).map(b => {
                  const bRoute = routes.find(r => r.id === b.routeId);
                  return (
                    <div key={b.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs">
                      <div className="flex items-center space-x-2">
                        <span 
                          className="w-2.5 h-2.5 rounded-full" 
                          style={{ backgroundColor: bRoute?.color }} 
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {b.busNumber} ({bRoute?.code})
                        </span>
                      </div>
                      <span className="font-bold font-mono text-blue-600 dark:text-blue-400">
                        {b.etaMinutes} min away
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-slate-400 italic">No shuttles currently dispatched to this stop.</p>
              )}
            </div>
          </div>
        )}

        {/* Selected Bus Floating Detail */}
        {selectedBus && !focusedStop && (
          <div className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg z-20 text-xs max-w-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-blue-600 dark:text-blue-400 font-mono">
                {selectedBus.busNumber} • {selectedBus.status}
              </span>
              <button onClick={() => setSelectedBusId(null)} className="text-slate-400 hover:text-slate-600 text-xs">✕</button>
            </div>
            <p className="text-slate-600 dark:text-slate-300 font-medium mt-1">
              Heading to: <strong className="text-slate-900 dark:text-slate-100">{stops.find(s => s.id === selectedBus.nextStopId)?.name}</strong>
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
              <span>Seats: {selectedBus.occupiedSeats}/{selectedBus.totalCapacity}</span>
              <span className="font-bold text-emerald-600">ETA {selectedBus.etaMinutes} mins</span>
            </div>
          </div>
        )}
      </div>

      {/* Campus Route Legend */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Route Network Legend
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {routes.map(r => (
            <div 
              key={r.id} 
              onClick={() => setSelectedRouteId(r.id)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
              <div className="truncate">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{r.code}</div>
                <div className="text-[10px] text-slate-400 truncate">{r.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
