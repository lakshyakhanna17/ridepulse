import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  AlertTriangle, 
  X, 
  Bus, 
  Clock, 
  Send, 
  Users, 
  Construction, 
  CloudRain, 
  CheckCircle2 
} from 'lucide-react';

export default function ReportDelayModal() {
  const { routes, buses, showReportModal, setShowReportModal, addReport } = useTransport();

  const [routeId, setRouteId] = useState(routes[0]?.id || '');
  const [delayMinutes, setDelayMinutes] = useState('5');
  const [category, setCategory] = useState('traffic'); // 'traffic', 'full_bus', 'weather', 'breakdown', 'other'
  const [details, setDetails] = useState('');

  if (!showReportModal) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Please provide a brief description of the issue or delay.');
      return;
    }

    const selectedRoute = routes.find(r => r.id === routeId);

    const titleMap = {
      traffic: 'Road congestion / Heavy campus traffic',
      full_bus: 'Shuttle packed / Passenger boarding surge',
      weather: 'Adverse weather / Rain slowdown',
      breakdown: 'Vehicle mechanical issue / Stopped',
      other: 'Campus transit delay advisory'
    };

    addReport({
      routeId,
      delayMinutes: parseInt(delayMinutes, 10),
      type: category === 'full_bus' ? 'crowding' : 'delay',
      title: titleMap[category] || 'Transit Delay',
      details: details.trim()
    });

    setShowReportModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full border border-slate-200 dark:border-slate-800 shadow-2xl p-6 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Report Campus Transit Delay
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Crowdsource updates to inform fellow students in real time
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowReportModal(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Affected Route */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Select Affected Line / Route:
            </label>
            <select
              value={routeId}
              onChange={(e) => setRouteId(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-semibold focus:ring-2 focus:ring-blue-500"
            >
              {routes.map(r => (
                <option key={r.id} value={r.id}>
                  {r.code} — {r.name}
                </option>
              ))}
            </select>
          </div>

          {/* Delay Duration */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Estimated Delay Length:
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['3', '5', '10', '15'].map(mins => (
                <button
                  type="button"
                  key={mins}
                  onClick={() => setDelayMinutes(mins)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    delayMinutes === mins
                      ? 'bg-rose-600 text-white border-rose-600 shadow-2xs'
                      : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                  }`}
                >
                  +{mins} mins
                </button>
              ))}
            </div>
          </div>

          {/* Issue Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Delay Reason / Type:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { id: 'traffic', label: 'Heavy Traffic', icon: Construction },
                { id: 'full_bus', label: 'Overcrowded / Full', icon: Users },
                { id: 'weather', label: 'Rain / Bad Weather', icon: CloudRain },
                { id: 'breakdown', label: 'Bus Breakdown', icon: Bus }
              ].map(cat => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center space-x-2 p-2.5 rounded-xl border font-medium text-left transition-all ${
                      isSelected
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Details / Location Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Specific Location / Details:
            </label>
            <textarea
              rows={3}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Traffic backup at North Gate barrier, shuttle skipped stop due to full capacity..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
              required
            />
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-500/20 active:scale-95 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast Alert</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

