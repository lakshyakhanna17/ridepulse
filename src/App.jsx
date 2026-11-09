import React from 'react';
import { useTransport } from './context/TransportContext';
import Navbar from './components/Navbar';
import LiveAlertsBanner from './components/LiveAlertsBanner';
import RouteFilter from './components/RouteFilter';
import ArrivalCard from './components/ArrivalCard';
import CampusMap from './components/CampusMap';
import CapacityInspector from './components/CapacityInspector';
import RouteScheduleModal from './components/RouteScheduleModal';
import TripPlanner from './components/TripPlanner';
import ReportDelayModal from './components/ReportDelayModal';
import Footer from './components/Footer';
import { 
  Bus, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  SlidersHorizontal, 
  CheckCircle2, 
  Info,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const { 
    buses, 
    routes, 
    stops, 
    selectedRouteId, 
    searchQuery, 
    activeTab, 
    favorites,
    showScheduleModal,
    setShowScheduleModal,
    notification
  } = useTransport();

  // Filter buses based on route selection, favorites, and search query
  const filteredBuses = buses.filter(bus => {
    // Route Filter
    if (selectedRouteId === 'favorites') {
      if (!favorites.routes.includes(bus.routeId)) return false;
    } else if (selectedRouteId !== 'all') {
      if (bus.routeId !== selectedRouteId) return false;
    }

    // Search Query (Bus number, Route Name, Stop name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const route = routes.find(r => r.id === bus.routeId);
      const curStop = stops.find(s => s.id === bus.currentStopId);
      const nxtStop = stops.find(s => s.id === bus.nextStopId);

      const matchesBus = bus.busNumber.toLowerCase().includes(q) || bus.plate.toLowerCase().includes(q);
      const matchesRoute = route?.name.toLowerCase().includes(q) || route?.code.toLowerCase().includes(q);
      const matchesStop = curStop?.name.toLowerCase().includes(q) || nxtStop?.name.toLowerCase().includes(q);

      if (!matchesBus && !matchesRoute && !matchesStop) return false;
    }

    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Navigation */}
      <Navbar />

      {/* Real-Time Delay & Incident Alerts Banner */}
      <LiveAlertsBanner />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Tab 1: Live Arrivals Dashboard */}
        {activeTab === 'live' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Filter and stats bar */}
            <RouteFilter />

            {/* Arrivals Card Grid */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-slate-100 flex items-center space-x-2">
                    <Bus className="w-5 h-5 text-blue-600" />
                    <span>Real-Time Campus Shuttle Arrivals</span>
                  </h2>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {filteredBuses.length} active
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="hidden sm:inline">Live GPS stream connected</span>
                </div>
              </div>

              {filteredBuses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredBuses.map(bus => (
                    <ArrivalCard key={bus.id} bus={bus} />
                  ))}
                </div>
              ) : (
                <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                    <Bus className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200">
                    No shuttles match your current filter
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try clearing your search query or selecting "All Lines" to view active campus shuttles.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Interactive Campus Map */}
        {activeTab === 'map' && (
          <div className="animate-in fade-in duration-200">
            <CampusMap />
          </div>
        )}

        {/* Tab 3: Route Timetables & Schedules */}
        {activeTab === 'schedule' && (
          <div className="animate-in fade-in duration-200">
            <RouteScheduleModal />
          </div>
        )}

        {/* Tab 4: Passenger Capacity & Crowding Inspector */}
        {activeTab === 'crowding' && (
          <div className="animate-in fade-in duration-200">
            <CapacityInspector />
          </div>
        )}

        {/* Tab 5: Trip Route Planner */}
        {activeTab === 'planner' && (
          <div className="animate-in fade-in duration-200">
            <TripPlanner />
          </div>
        )}

      </main>

      {/* Floating Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-2xl border border-slate-700 dark:border-slate-200 text-xs font-semibold animate-in slide-in-from-bottom-5">
          {notification.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
          ) : (
            <Info className="w-4 h-4 text-blue-400 dark:text-blue-600 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Modals */}
      {showScheduleModal && (
        <RouteScheduleModal isModal onClose={() => setShowScheduleModal(false)} />
      )}

      <ReportDelayModal />

      {/* Footer */}
      <Footer />

    </div>
  );
}
