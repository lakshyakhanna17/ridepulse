import React from 'react';
import { useTransport } from '../context/TransportContext';
import { Search, Star, Bus, Zap, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export default function RouteFilter() {
  const { 
    routes, 
    buses,
    selectedRouteId, 
    setSelectedRouteId, 
    searchQuery, 
    setSearchQuery,
    favorites
  } = useTransport();

  const totalBuses = buses.length;
  const onTimeBuses = buses.filter(b => b.delayMinutes === 0).length;
  const delayedBuses = buses.filter(b => b.delayMinutes > 0).length;

  return (
    <div className="space-y-4">
      {/* Top Quick Status Pill Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Active Fleet</div>
            <div className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-1.5">
              <span>{totalBuses} Shuttles</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">On-Time Performance</div>
            <div className="text-base font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round((onTimeBuses / totalBuses) * 100)}% Normal
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Minor Delays</div>
            <div className="text-base font-bold text-amber-600 dark:text-amber-400">
              {delayedBuses} {delayedBuses === 1 ? 'Route' : 'Routes'}
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-2xs flex items-center space-x-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Next Arrival</div>
            <div className="text-base font-bold text-indigo-600 dark:text-indigo-400">
              1 - 3 mins
            </div>
          </div>
        </div>
      </div>

      {/* Filter bar and search input */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search stop, lecture hall, or bus ID (e.g. Library, RP-01)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white dark:focus:bg-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Clear
            </button>
          )}
        </div>

        {/* Route Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
          <button
            onClick={() => setSelectedRouteId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedRouteId === 'all'
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
            }`}
          >
            All Lines ({buses.length})
          </button>

          {/* Quick filter for favorites */}
          <button
            onClick={() => setSelectedRouteId(selectedRouteId === 'favorites' ? 'all' : 'favorites')}
            className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedRouteId === 'favorites'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${selectedRouteId === 'favorites' ? 'fill-current' : ''}`} />
            <span>Starred ({favorites.routes.length})</span>
          </button>

          {routes.map(route => {
            const isSelected = selectedRouteId === route.id;
            const activeCount = buses.filter(b => b.routeId === route.id).length;
            return (
              <button
                key={route.id}
                onClick={() => setSelectedRouteId(isSelected ? 'all' : route.id)}
                className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? `${route.bgColor} text-white shadow-xs`
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: isSelected ? '#ffffff' : route.color }} 
                />
                <span>{route.code}</span>
                <span className={`text-[10px] px-1 rounded-full ${isSelected ? 'bg-white/20' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
                  {activeCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
