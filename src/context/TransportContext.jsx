import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ROUTES, INITIAL_STOPS, INITIAL_BUSES, INITIAL_ALERTS } from '../data/mockData';

const TransportContext = createContext();

export function TransportProvider({ children }) {
  const [routes] = useState(INITIAL_ROUTES);
  const [stops] = useState(INITIAL_STOPS);
  const [buses, setBuses] = useState(INITIAL_BUSES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  // Filters & Selection
  const [selectedRouteId, setSelectedRouteId] = useState('all');
  const [selectedStopId, setSelectedStopId] = useState(null);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('live'); // 'live' | 'map' | 'schedule' | 'planner' | 'crowding'

  // User Preferences
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('ridepulse_favs');
      return saved ? JSON.parse(saved) : { routes: ['blue-line'], stops: ['stop-4'] };
    } catch {
      return { routes: ['blue-line'], stops: ['stop-4'] };
    }
  });

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('ridepulse_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // Simulation controls
  const [isSimulating, setIsSimulating] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1); // 1x, 2x

  // Sync dark mode class with <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('ridepulse_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('ridepulse_theme', 'light');
    }
  }, [darkMode]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ridepulse_favs', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Trigger Toast Notification helper
  const notify = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.id ? null : prev));
    }, 4500);
  };

  // Toggle Favorite
  const toggleFavoriteRoute = (routeId) => {
    setFavorites(prev => {
      const exists = prev.routes.includes(routeId);
      const nextRoutes = exists ? prev.routes.filter(id => id !== routeId) : [...prev.routes, routeId];
      notify(exists ? 'Removed route from favorites' : 'Saved route to quick favorites!', 'success');
      return { ...prev, routes: nextRoutes };
    });
  };

  const toggleFavoriteStop = (stopId) => {
    setFavorites(prev => {
      const exists = prev.stops.includes(stopId);
      const nextStops = exists ? prev.stops.filter(id => id !== stopId) : [...prev.stops, stopId];
      notify(exists ? 'Removed stop from favorites' : 'Saved stop to quick favorites!', 'success');
      return { ...prev, stops: nextStops };
    });
  };

  // Upvote / Verify Alert
  const upvoteAlert = (alertId) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, verifiedCount: alert.verifiedCount + 1, hasUpvoted: true } : alert
      )
    );
    notify('Thank you for confirming this transit alert!', 'success');
  };

  // Submit User Crowdsourced Delay / Issue Report
  const addReport = (newReport) => {
    const newAlert = {
      id: `alert-user-${Date.now()}`,
      routeId: newReport.routeId,
      busNumber: newReport.busNumber || null,
      type: newReport.type || 'delay',
      severity: newReport.delayMinutes > 5 ? 'warning' : 'info',
      title: `${newReport.delayMinutes || 5}-min delay: ${newReport.title}`,
      message: newReport.details,
      timestamp: 'Just now',
      verifiedCount: 1,
      reportedBy: `Student #${Math.floor(1000 + Math.random() * 9000)}`
    };

    setAlerts(prev => [newAlert, ...prev]);

    // If report targeted a specific bus or route, reflect the delay in active buses
    if (newReport.routeId) {
      setBuses(prev =>
        prev.map(bus => {
          if (bus.routeId === newReport.routeId) {
            const addedDelay = parseInt(newReport.delayMinutes, 10) || 5;
            return {
              ...bus,
              delayMinutes: bus.delayMinutes + addedDelay,
              etaMinutes: Math.max(1, bus.etaMinutes + addedDelay),
              status: 'Delayed',
              delayReason: newReport.title
            };
          }
          return bus;
        })
      );
    }

    notify('Incident reported to campus dispatch & students!', 'success');
  };

  // Live Simulation Heartbeat: Simulates bus moving along stops, capacity fluctuations, ETA updates
  useEffect(() => {
    if (!isSimulating) return;

    const intervalTime = Math.max(1000, 3000 / simSpeed);
    const timer = setInterval(() => {
      setBuses(prevBuses =>
        prevBuses.map(bus => {
          const route = routes.find(r => r.id === bus.routeId);
          if (!route) return bus;

          let newProgress = bus.progress + Math.floor(Math.random() * 8 + 4) * simSpeed;
          let newCurrentStop = bus.currentStopId;
          let newNextStop = bus.nextStopId;
          let newEta = bus.etaMinutes;
          let newOccupied = bus.occupiedSeats;
          let newStanding = bus.standingCount;

          if (newProgress >= 100) {
            // Bus arrived at next stop! Advance to subsequent stop in route
            newProgress = 5;
            newCurrentStop = bus.nextStopId;
            const currentIdx = route.stops.indexOf(newCurrentStop);
            const nextIdx = (currentIdx + 1) % route.stops.length;
            newNextStop = route.stops[nextIdx];
            newEta = Math.floor(Math.random() * 5 + 4);

            // Passenger exchange at stop
            const offboarding = Math.floor(Math.random() * 12);
            const onboarding = Math.floor(Math.random() * 14);
            const netSeats = Math.max(5, Math.min(bus.totalCapacity, bus.occupiedSeats - offboarding + onboarding));
            newOccupied = netSeats;
            newStanding = newOccupied >= bus.totalCapacity ? Math.floor(Math.random() * 8) : 0;
          } else {
            // Progressing towards next stop
            if (newProgress > 80 && newEta > 1) {
              newEta = 1;
            } else if (newProgress > 50 && newEta > 2) {
              newEta = Math.max(1, newEta - 1);
            }
          }

          return {
            ...bus,
            progress: newProgress,
            currentStopId: newCurrentStop,
            nextStopId: newNextStop,
            etaMinutes: newEta,
            occupiedSeats: newOccupied,
            standingCount: newStanding,
            updatedAgoSec: Math.floor(Math.random() * 5 + 1)
          };
        })
      );
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isSimulating, simSpeed, routes]);

  const value = {
    routes,
    stops,
    buses,
    alerts,
    selectedRouteId,
    setSelectedRouteId,
    selectedStopId,
    setSelectedStopId,
    selectedBusId,
    setSelectedBusId,
    searchQuery,
    setSearchQuery,
    activeTab,
    setActiveTab,
    favorites,
    toggleFavoriteRoute,
    toggleFavoriteStop,
    darkMode,
    setDarkMode,
    showScheduleModal,
    setShowScheduleModal,
    showReportModal,
    setShowReportModal,
    notification,
    notify,
    upvoteAlert,
    addReport,
    isSimulating,
    setIsSimulating,
    simSpeed,
    setSimSpeed
  };

  return (
    <TransportContext.Provider value={value}>
      {children}
    </TransportContext.Provider>
  );
}

export function useTransport() {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
}
