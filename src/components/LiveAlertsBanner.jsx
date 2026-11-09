import React, { useState } from 'react';
import { useTransport } from '../context/TransportContext';
import { AlertCircle, ChevronDown, ChevronUp, ThumbsUp, X, Bell, ShieldAlert, Sparkles } from 'lucide-react';

export default function LiveAlertsBanner() {
  const { alerts, upvoteAlert, routes } = useTransport();
  const [isExpanded, setIsExpanded] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const visibleAlerts = alerts.filter(a => !dismissedAlerts.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  const currentAlert = visibleAlerts[0];
  const route = routes.find(r => r.id === currentAlert.routeId);

  const handleDismiss = (id, e) => {
    e.stopPropagation();
    setDismissedAlerts(prev => [...prev, id]);
  };

  return (
    <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border-b border-amber-200 dark:border-amber-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          
          {/* Main Alert Preview */}
          <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 sm:mt-0">
              <ShieldAlert className="w-4 h-4" />
            </div>
            
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm">
              <span className="font-bold text-amber-900 dark:text-amber-300">
                Live Transit Notice:
              </span>
              
              {route && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-amber-300 dark:border-amber-800 shadow-2xs">
                  {route.name}
                </span>
              )}

              <span className="font-medium text-slate-800 dark:text-slate-200 truncate">
                {currentAlert.title}
              </span>

              <span className="text-slate-500 dark:text-slate-400 text-xs hidden lg:inline">
                • {currentAlert.message}
              </span>
            </div>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center space-x-2 self-end sm:self-auto shrink-0">
            {/* Student verification count */}
            <button
              onClick={() => upvoteAlert(currentAlert.id)}
              disabled={currentAlert.hasUpvoted}
              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded text-xs font-medium border transition-colors ${
                currentAlert.hasUpvoted
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40'
              }`}
              title="Confirm this alert if you are on campus"
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${currentAlert.hasUpvoted ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{currentAlert.verifiedCount} confirmed</span>
            </button>

            {/* Toggle dropdown of all alerts */}
            {visibleAlerts.length > 1 && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/50 rounded transition-colors"
              >
                <span>{visibleAlerts.length} notices</span>
                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}

            {/* Dismiss button */}
            <button
              onClick={(e) => handleDismiss(currentAlert.id, e)}
              className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
              title="Dismiss Notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Expanded Drawer for Multiple Alerts */}
        {isExpanded && visibleAlerts.length > 1 && (
          <div className="mt-3 pt-3 border-t border-amber-200/60 dark:border-amber-900/40 grid grid-cols-1 md:grid-cols-2 gap-3">
            {visibleAlerts.slice(1).map(alert => {
              const alertRoute = routes.find(r => r.id === alert.routeId);
              return (
                <div key={alert.id} className="p-2.5 rounded-lg bg-white dark:bg-slate-800/90 border border-amber-200 dark:border-amber-900/60 flex items-start justify-between gap-3 text-xs shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      {alertRoute && (
                        <span className="font-semibold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200">
                          {alertRoute.name}
                        </span>
                      )}
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {alert.title}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      {alert.message}
                    </p>
                    <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                      <span>Reported: {alert.timestamp}</span>
                      <span>•</span>
                      <span>Source: {alert.reportedBy}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 shrink-0">
                    <button
                      onClick={() => upvoteAlert(alert.id)}
                      disabled={alert.hasUpvoted}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600"
                      title="Verify alert"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleDismiss(alert.id, e)}
                      className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
