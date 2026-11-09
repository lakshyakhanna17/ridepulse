import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { TIMETABLE_DATA } from '../data/mockData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X, 
  ArrowRight, 
  Download, 
  Bus, 
  ShieldCheck, 
  FileText,
  Sparkles
} from 'lucide-react';

export default function RouteScheduleModal({ isModal = false, onClose }) {
  const { routes, stops, selectedRouteId, setSelectedRouteId, notify } = useTransport();

  const [activeRouteTab, setActiveRouteTab] = useState(
    selectedRouteId !== 'all' && selectedRouteId !== 'favorites' ? selectedRouteId : 'blue-line'
  );
  const [dayType, setDayType] = useState('weekday'); // 'weekday' | 'weekend'

  const activeRoute = routes.find(r => r.id === activeRouteTab) || routes[0];
  const departures = TIMETABLE_DATA[activeRoute.id] || [];

  const handleDownloadPDF = () => {
    notify(`Downloaded timetable for ${activeRoute.name} (PDF format)`, 'success');
  };

  const content = (
    <div className="space-y-6">
      
      {/* Route Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {routes.map(r => {
          const isSelected = r.id === activeRoute.id;
          return (
            <button
              key={r.id}
              onClick={() => setActiveRouteTab(r.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: isSelected ? '#FFFFFF' : r.color }} />
              <span>{r.code}</span>
              <span className="font-normal opacity-85 hidden sm:inline">• {r.name.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>

      {/* Route Meta Overview Card */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span 
              className="px-2 py-0.5 rounded text-xs font-black text-white" 
              style={{ backgroundColor: activeRoute.color }}
            >
              {activeRoute.code}
            </span>
            <h2 className="text-lg font-black text-slate-900 dark:text-slate-100">
              {activeRoute.name} Timetable
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {activeRoute.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
            <span className="flex items-center space-x-1">
              <Clock className="w-3.5 h-3.5 text-blue-500" />
              <span>Operating: <strong>{activeRoute.operatingHours}</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <Bus className="w-3.5 h-3.5 text-emerald-500" />
              <span>Frequency: <strong>{activeRoute.frequency}</strong></span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>Distance: <strong>{activeRoute.totalDistance}</strong></span>
            </span>
          </div>
        </div>

        {/* Weekday / Weekend toggle & Download button */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex">
            <button
              onClick={() => setDayType('weekday')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dayType === 'weekday' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Mon - Fri
            </button>
            <button
              onClick={() => setDayType('weekend')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                dayType === 'weekend' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
              }`}
            >
              Sat - Sun
            </button>
          </div>

          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center justify-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Print Timetable</span>
          </button>
        </div>
      </div>

      {/* Stop Sequence Map Timeline */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
          Official Route Stops Order
        </h3>
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
          {activeRoute.stops.map((stopId, idx) => {
            const stop = stops.find(s => s.id === stopId);
            const isLast = idx === activeRoute.stops.length - 1;
            return (
              <React.Fragment key={stopId}>
                <div className="flex flex-col items-center shrink-0 min-w-[120px] text-center p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <span className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                    {stop?.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {stop?.zone}
                  </span>
                </div>
                {!isLast && <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Departure Schedule Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>Scheduled Departures ({dayType === 'weekday' ? 'Weekday Standard' : 'Weekend Reduced Service'})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">
            {departures.length} Total Departures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 border-b border-slate-200 dark:border-slate-800">
                <th className="px-4 py-3 font-semibold">Scheduled Departure</th>
                <th className="px-4 py-3 font-semibold">Origin Terminal</th>
                <th className="px-4 py-3 font-semibold">Destination Terminal</th>
                <th className="px-4 py-3 font-semibold">Trip Duration</th>
                <th className="px-4 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {departures.map((row, i) => (
                <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                    {row.departure}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {row.from}
                  </td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">
                    {row.to}
                  </td>
                  <td className="px-4 py-3 font-mono text-slate-500">
                    {row.duration}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      row.status.includes('Active')
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 animate-pulse'
                        : row.status === 'Completed'
                        ? 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                        : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
        <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                Official Campus Shuttle Timetables
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          {content}
        </div>
      </div>
    );
  }

  return content;
}
