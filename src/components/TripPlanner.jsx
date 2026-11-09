import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  Navigation, 
  MapPin, 
  ArrowUpDown, 
  Clock, 
  Bus, 
  CheckCircle2, 
  Sparkles, 
  ChevronRight,
  Footprints,
  ShieldAlert
} from 'lucide-react';

export default function TripPlanner() {
  const { stops, routes, buses, setActiveTab, setSelectedBusId } = useTransport();

  const [fromStopId, setFromStopId] = useState(stops[0].id);
  const [toStopId, setToStopId] = useState(stops[3].id); // Central Library

  const handleSwap = () => {
    const temp = fromStopId;
    setFromStopId(toStopId);
    setToStopId(temp);
  };

  const fromStop = stops.find(s => s.id === fromStopId);
  const toStop = stops.find(s => s.id === toStopId);

  // Find direct routes that serve both stops
  const directRoutes = routes.filter(r => 
    r.stops.includes(fromStopId) && r.stops.includes(toStopId)
  );

  // Find incoming buses on those routes
  const availableBuses = directRoutes.flatMap(route => 
    buses.filter(b => b.routeId === route.id)
  );

  return (
    <div className="space-y-6">
      
      {/* Search / Selection Card */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 dark:text-slate-100 mb-4">
          <Navigation className="w-5 h-5 text-blue-600" />
          <span>Point-to-Point Campus Trip Route Finder</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          
          {/* Origin */}
          <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Starting From (Current Stop)
            </label>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <select
                value={fromStopId}
                onChange={(e) => setFromStopId(e.target.value)}
                className="w-full bg-transparent border-none text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-0 p-0 cursor-pointer"
              >
                {stops.map(s => (
                  <option key={s.id} value={s.id} className="dark:bg-slate-900">
                    {s.name} ({s.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors shadow-2xs"
              title="Swap Origin and Destination"
            >
              <ArrowUpDown className="w-4 h-4" />
            </button>
          </div>

          {/* Destination */}
          <div className="md:col-span-5 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700/80">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Going To (Destination)
            </label>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <select
                value={toStopId}
                onChange={(e) => setToStopId(e.target.value)}
                className="w-full bg-transparent border-none text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 focus:ring-0 p-0 cursor-pointer"
              >
                {stops.map(s => (
                  <option key={s.id} value={s.id} className="dark:bg-slate-900">
                    {s.name} ({s.zone})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Suggested Routes / Trips */}
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-blue-500" />
          <span>Recommended Transit Options</span>
        </h3>

        {directRoutes.length > 0 ? (
          <div className="space-y-3">
            {directRoutes.map(route => {
              const routeBuses = buses.filter(b => b.routeId === route.id);
              const nextBus = routeBuses[0];

              return (
                <div 
                  key={route.id}
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-400 transition-all"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex items-center space-x-3">
                      <span 
                        className="w-3 h-10 rounded-full"
                        style={{ backgroundColor: route.color }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded text-xs font-black uppercase ${route.pillClass}`}>
                            {route.code}
                          </span>
                          <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                            {route.name} (Direct)
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          Runs {route.frequency} • Total trip ~9 mins
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {nextBus && (
                        <div className="text-right">
                          <div className="text-xs text-slate-400">Next Shuttle ({nextBus.busNumber})</div>
                          <div className="text-sm font-black font-mono text-emerald-600 dark:text-emerald-400">
                            Arrives in {nextBus.etaMinutes} mins
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          if (nextBus) setSelectedBusId(nextBus.id);
                          setActiveTab('map');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Track Route
                      </button>
                    </div>
                  </div>

                  {/* Step by Step Walking & Riding Breakdown */}
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start space-x-2.5">
                      <Footprints className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">1. Walk to Platform</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">~2 min walk to {fromStop?.name}</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start space-x-2.5">
                      <Bus className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">2. Board {route.code}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">Ride 3 stops directly without transfers</div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-bold text-slate-800 dark:text-slate-200">3. Arrive at Destination</div>
                        <div className="text-slate-500 dark:text-slate-400 text-[11px]">Alight at {toStop?.name}</div>
                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-slate-100">
                Transfer Recommended
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1">
                There is no single direct route between {fromStop?.name} and {toStop?.name}. 
                Board the nearest shuttle to <strong>Central Library Hub (Stop 4)</strong> and transfer to your destination line.
              </p>
            </div>
            <button
              onClick={() => setToStopId('stop-4')}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Route via Central Library Hub
            </button>
          </div>
        )}
      </div>

    </div>
  );
}

