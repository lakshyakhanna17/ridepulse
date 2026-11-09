import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { HOURLY_OCCUPANCY_TRENDS } from '../data/mockData';
import { 
  Users, 
  UserCheck, 
  AlertCircle, 
  TrendingUp, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Bus,
  Zap,
  Info
} from 'lucide-react';

export default function CapacityInspector() {
  const { buses, routes } = useTransport();
  const [selectedHour, setSelectedHour] = useState('19:00');

  // Compute fleet wide metrics
  const totalSeats = buses.reduce((acc, b) => acc + b.totalCapacity, 0);
  const occupiedSeats = buses.reduce((acc, b) => acc + b.occupiedSeats, 0);
  const standingPassengers = buses.reduce((acc, b) => acc + b.standingCount, 0);
  const averageOccupancy = Math.round((occupiedSeats / totalSeats) * 100);

  const lowCrowdCount = buses.filter(b => (b.occupiedSeats / b.totalCapacity) < 0.6).length;
  const mediumCrowdCount = buses.filter(b => {
    const ratio = b.occupiedSeats / b.totalCapacity;
    return ratio >= 0.6 && ratio < 0.85;
  }).length;
  const fullCrowdCount = buses.filter(b => (b.occupiedSeats / b.totalCapacity) >= 0.85).length;

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Fleet Average Occupancy */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Fleet Occupancy
            </span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 font-mono">
            {averageOccupancy}%
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all duration-500" 
              style={{ width: `${averageOccupancy}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            {occupiedSeats} seated of {totalSeats} total fleet seats
          </p>
        </div>

        {/* Empty Seats Available */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Available Seats
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2 font-mono">
            {totalSeats - occupiedSeats}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-700 dark:text-emerald-300 mt-3 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Ready for boarding now</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Across {buses.length} active shuttles
          </p>
        </div>

        {/* Standing Room */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Standing Passengers
            </span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-2 font-mono">
            {standingPassengers}
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-amber-700 dark:text-amber-300 mt-3 font-medium">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Peak route pressure</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mainly Blue Line & Green Line
          </p>
        </div>

        {/* Smart Student Recommendation */}
        <div className="bg-gradient-to-br from-indigo-500 to-blue-700 p-5 rounded-2xl text-white shadow-md flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-indigo-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Smart Commute Tip</span>
            </div>
            <h4 className="font-bold text-sm mt-2 leading-snug">
              Avoid 08:30 - 09:15 Rush!
            </h4>
            <p className="text-xs text-indigo-100 mt-1">
              Shuttles starting at 08:10 AM have 40% more empty seats than 08:45 AM buses.
            </p>
          </div>
          <div className="text-[11px] font-mono text-indigo-200 mt-3 pt-2 border-t border-indigo-400/30">
            Current campus status: Moderate load
          </div>
        </div>

      </div>

      {/* Hourly Crowding Trend Chart (Visual Bar Graph) */}
      <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Campus Shuttle Demand & Crowding by Hour</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Historical crowd patterns to help students choose the least crowded shuttle times.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-600 dark:text-slate-300">Low (&lt;50%)</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-600 dark:text-slate-300">Moderate</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <span className="text-slate-600 dark:text-slate-300">High / Packed</span>
            </span>
          </div>
        </div>

        {/* Hourly visual columns */}
        <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-15 gap-2 items-end h-44 pt-6 pb-2 border-b border-slate-100 dark:border-slate-800">
          {HOURLY_OCCUPANCY_TRENDS.map(item => {
            const isSelected = selectedHour === item.hour;
            return (
              <div 
                key={item.hour}
                onClick={() => setSelectedHour(item.hour)}
                className="flex flex-col items-center h-full justify-end cursor-pointer group"
              >
                {/* Tooltip on hover */}
                <span className="text-[10px] font-bold font-mono text-slate-500 dark:text-slate-400 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.level}%
                </span>

                {/* Column bar */}
                <div className="w-full max-w-[28px] bg-slate-100 dark:bg-slate-800 rounded-t-lg overflow-hidden flex flex-col justify-end p-0.5">
                  <div 
                    className={`w-full rounded-t-md transition-all duration-300 ${item.color} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-slate-900' : 'group-hover:brightness-110'}`}
                    style={{ height: `${item.level}%` }}
                  />
                </div>

                {/* Hour label */}
                <span className={`text-[10px] mt-2 font-mono whitespace-nowrap ${isSelected ? 'font-bold text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Hour Details */}
        {selectedHour && (
          <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                {selectedHour} Trend:
              </span>
              <span className="text-slate-600 dark:text-slate-300">
                {HOURLY_OCCUPANCY_TRENDS.find(h => h.hour === selectedHour)?.level}% average vehicle load ({HOURLY_OCCUPANCY_TRENDS.find(h => h.hour === selectedHour)?.category} Crowding).
              </span>
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-semibold cursor-pointer">
              View Recommended Alternatives →
            </span>
          </div>
        )}
      </div>

      {/* Individual Bus Live Capacity Breakdown */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center space-x-2">
          <Bus className="w-4 h-4 text-blue-500" />
          <span>Real-Time Fleet Passenger Manifest</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                <th className="pb-3">Shuttle ID</th>
                <th className="pb-3">Route Line</th>
                <th className="pb-3">Current Load</th>
                <th className="pb-3">Open Seats</th>
                <th className="pb-3">Standing</th>
                <th className="pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {buses.map(bus => {
                const route = routes.find(r => r.id === bus.routeId);
                const percent = Math.round((bus.occupiedSeats / bus.totalCapacity) * 100);
                const freeSeats = bus.totalCapacity - bus.occupiedSeats;

                let tagClass = 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300';
                let tagText = 'Ample Seats';
                if (percent >= 90) {
                  tagClass = 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300';
                  tagText = 'Near Capacity';
                } else if (percent >= 70) {
                  tagClass = 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300';
                  tagText = 'Filling Fast';
                }

                return (
                  <tr key={bus.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {bus.busNumber}
                    </td>
                    <td className="py-3">
                      <span className="font-semibold" style={{ color: route?.color }}>
                        {route?.name}
                      </span>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${percent >= 90 ? 'bg-rose-500' : percent >= 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                        <span className="font-mono font-medium">{percent}%</span>
                      </div>
                    </td>
                    <td className="py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {freeSeats} seats
                    </td>
                    <td className="py-3 font-mono">
                      {bus.standingCount > 0 ? (
                        <span className="text-amber-600 font-semibold">+{bus.standingCount} standing</span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${tagClass}`}>
                        {tagText}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

