import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  Bus, 
  MapPin, 
  Clock, 
  Users, 
  AlertTriangle, 
  Star, 
  Bell, 
  BellRing, 
  Zap, 
  CheckCircle2, 
  ChevronRight,
  ShieldCheck,
  Compass,
  ArrowRight
} from 'lucide-react';

export default function ArrivalCard({ bus }) {
  const { 
    routes, 
    stops, 
    favorites, 
    toggleFavoriteRoute, 
    notify, 
    setActiveTab, 
    setSelectedBusId,
    setShowReportModal
  } = useTransport();

  const [hasReminder, setHasReminder] = useState(false);

  const route = routes.find(r => r.id === bus.routeId);
  const currentStop = stops.find(s => s.id === bus.currentStopId);
  const nextStop = stops.find(s => s.id === bus.nextStopId);

  const isFavorite = favorites.routes.includes(bus.routeId);

  // Capacity calculations
  const totalCapacity = bus.totalCapacity;
  const occupiedSeats = bus.occupiedSeats;
  const standingCount = bus.standingCount;
  const occupancyPercent = Math.min(100, Math.round(((occupiedSeats + standingCount) / totalCapacity) * 100));

  let capacityStatus = {
    label: 'Seats Available',
    color: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    barColor: 'bg-emerald-500'
  };

  if (occupancyPercent >= 90) {
    capacityStatus = {
      label: 'Standing Room Only',
      color: 'text-rose-700 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      barColor: 'bg-rose-500'
    };
  } else if (occupancyPercent >= 70) {
    capacityStatus = {
      label: 'Moderate Crowding',
      color: 'text-amber-700 bg-amber-50 dark:bg-amber-950/50 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      barColor: 'bg-amber-500'
    };
  }

  const handleToggleReminder = () => {
    if (!hasReminder) {
      setHasReminder(true);
      notify(`Arrival alert set for ${bus.busNumber}! You'll be notified when it is 1 stop away.`, 'success');
    } else {
      setHasReminder(false);
      notify(`Alert cancelled for ${bus.busNumber}.`, 'info');
    }
  };

  const handleViewOnMap = () => {
    setSelectedBusId(bus.id);
    setActiveTab('map');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
      
      {/* Card Header: Route code, line name, bookmark, ETA pill */}
      <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-start justify-between gap-3">
          
          <div className="flex items-center space-x-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-xs font-bold text-lg"
              style={{ backgroundColor: route?.color || '#2563EB' }}
            >
              <Bus className="w-6 h-6" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-0.5 rounded-md text-xs font-extrabold uppercase tracking-wide ${route?.pillClass}`}>
                  {route?.code}
                </span>
                <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
                  {bus.busNumber} • {bus.plate}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {route?.name}
              </h3>
            </div>
          </div>

          {/* Big ETA Countdown Pill */}
          <div className="text-right shrink-0">
            <div className="inline-flex flex-col items-end">
              <div className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black tracking-tight flex items-center space-x-1.5 shadow-2xs ${
                bus.etaMinutes <= 2 
                  ? 'bg-rose-600 text-white animate-pulse'
                  : 'bg-blue-600 text-white'
              }`}>
                <Clock className="w-3.5 h-3.5" />
                <span>{bus.etaMinutes <= 1 ? 'ARRIVING NOW' : `IN ${bus.etaMinutes} MINS`}</span>
              </div>
              <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 font-mono">
                Updated {bus.updatedAgoSec}s ago
              </span>
            </div>
          </div>
        </div>

        {/* Delay Status Indicator */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {bus.delayMinutes > 0 ? (
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>+{bus.delayMinutes} min delay</span>
              {bus.delayReason && (
                <span className="text-amber-600 dark:text-amber-400 font-normal">
                  ({bus.delayReason})
                </span>
              )}
            </div>
          ) : (
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>On Schedule</span>
            </div>
          )}

          {bus.isElectric && (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              <Zap className="w-3 h-3 text-emerald-500" />
              <span>Zero-Emission EV</span>
            </span>
          )}

          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            A/C: {bus.acStatus}
          </span>
        </div>
      </div>

      {/* Body: Live Trajectory & Next Stop */}
      <div className="p-4 sm:p-5 space-y-4">
        
        {/* Next Stop Callout */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <span className="flex items-center space-x-1 font-semibold uppercase tracking-wider text-[10px]">
              <MapPin className="w-3 h-3 text-blue-500" />
              <span>Route Progress</span>
            </span>
            <span className="font-mono">{bus.progress}% to next stop</span>
          </div>

          <div className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-800 dark:text-slate-200">
            <div className="truncate max-w-[45%] text-slate-500 dark:text-slate-400 text-xs">
              {currentStop?.name || 'Departed Quad'}
            </div>
            <ArrowRight className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="truncate max-w-[50%] text-blue-600 dark:text-blue-400 font-bold">
              {nextStop?.name || 'Central Terminal'}
            </div>
          </div>

          {/* Animated Progress Track */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full mt-2.5 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ 
                width: `${Math.min(100, Math.max(5, bus.progress))}%`,
                backgroundColor: route?.color || '#2563EB'
              }}
            />
          </div>
        </div>

        {/* Passenger Capacity & Crowding Gauge */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Passenger Capacity
              </span>
            </div>
            
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${capacityStatus.color}`}>
              {capacityStatus.label}
            </span>
          </div>

          {/* Occupancy visual bar */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden flex border border-slate-200 dark:border-slate-700">
            <div 
              className={`h-full ${capacityStatus.barColor} transition-all duration-500`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1.5">
            <span>
              <strong>{occupiedSeats}</strong> / {totalCapacity} Seats Filled ({occupancyPercent}%)
            </span>
            {standingCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                +{standingCount} Standing
              </span>
            ) : (
              <span className="text-emerald-600 dark:text-emerald-400">
                {totalCapacity - occupiedSeats} open seats
              </span>
            )}
          </div>
        </div>

        {/* Driver & Route Info */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
            <span>Driver: <strong className="text-slate-700 dark:text-slate-300">{bus.driver}</strong></span>
          </div>
          <span className="font-mono">{route?.frequency}</span>
        </div>
      </div>

      {/* Card Footer: Quick Actions */}
      <div className="px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          {/* Favorite route button */}
          <button
            onClick={() => toggleFavoriteRoute(bus.routeId)}
            className={`p-2 rounded-xl text-xs font-medium border transition-colors ${
              isFavorite 
                ? 'bg-amber-50 text-amber-600 border-amber-300 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-700' 
                : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:text-amber-500'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Star this route'}
          >
            <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
          </button>

          {/* Set Reminder Button */}
          <button
            onClick={handleToggleReminder}
            className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              hasReminder
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
            }`}
          >
            {hasReminder ? <BellRing className="w-3.5 h-3.5 animate-bounce" /> : <Bell className="w-3.5 h-3.5 text-slate-400" />}
            <span>{hasReminder ? 'Alert Active' : 'Notify Me'}</span>
          </button>
        </div>

        {/* View on Map button */}
        <button
          onClick={handleViewOnMap}
          className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 group-hover:translate-x-0.5 transition-transform"
        >
          <span>Track Live</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

