import React, { useState, useEffect } from 'react';
import { useTransport } from '../context/TransportContext';
import { 
  Bus, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Navigation, 
  Moon, 
  Sun, 
  Play, 
  Pause, 
  FastForward,
  PlusCircle,
  Sparkles
} from 'lucide-react';

export default function Navbar() {
  const { 
    activeTab, 
    setActiveTab, 
    darkMode, 
    setDarkMode, 
    setShowReportModal,
    setShowScheduleModal,
    isSimulating,
    setIsSimulating,
    simSpeed,
    setSimSpeed,
    alerts
  } = useTransport();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const urgentAlertCount = alerts.filter(a => a.severity === 'warning').length;

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('live')}>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Bus className="w-5 h-5" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-300 bg-clip-text text-transparent">
                  RidePulse
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                  Campus Live
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Real-Time Shuttle & Route Intelligence
              </p>
            </div>
          </div>

          {/* Center: Live Clock & Simulation Controller */}
          <div className="hidden md:flex items-center space-x-3 bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-1.5 text-xs font-mono font-medium text-slate-600 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '12s' }} />
              <span>{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
            </div>
            <div className="h-3.5 w-px bg-slate-300 dark:bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setIsSimulating(!isSimulating)}
                className={`p-1 rounded-full text-xs transition-colors ${
                  isSimulating 
                    ? 'text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-950/60' 
                    : 'text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-950/60'
                }`}
                title={isSimulating ? 'Pause Live Simulation' : 'Resume Live Simulation'}
              >
                {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setSimSpeed(simSpeed === 1 ? 2 : 1)}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded transition-colors ${
                  simSpeed === 2 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
                title="Toggle Simulation Speed"
              >
                {simSpeed}x
              </button>
              <span className="text-[11px] text-slate-400">Live Pulse</span>
            </div>
          </div>

          {/* Actions & Utilities */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowReportModal(true)}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800 transition-all shadow-sm active:scale-95"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Report Delay</span>
              {urgentAlertCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {urgentAlertCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setShowScheduleModal(true)}
              className="hidden lg:inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-all"
            >
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              <span>Full Timetable</span>
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu */}
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2 pt-1 border-t border-slate-100 dark:border-slate-800/80 no-scrollbar">
          {[
            { id: 'live', label: 'Live Arrivals & ETAs', icon: Bus },
            { id: 'map', label: 'Interactive Campus Map', icon: MapPin },
            { id: 'schedule', label: 'Timetables & Lines', icon: Calendar },
            { id: 'crowding', label: 'Passenger Capacity', icon: Users },
            { id: 'planner', label: 'Trip Route Planner', icon: Navigation }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg whitespace-nowrap transition-all duration-150 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

