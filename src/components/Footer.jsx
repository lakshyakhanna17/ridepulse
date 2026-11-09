import React from 'react';
import { Bus, ShieldCheck, Phone, HelpCircle, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xs transition-colors py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Bus className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-slate-100">
                RidePulse
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Real-time student campus mobility intelligence, live arrival telemetry, seat occupancy forecasts and delay alerts.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Campus Lines
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li><span className="text-blue-500 font-bold">B-101:</span> North Campus Express</li>
              <li><span className="text-amber-500 font-bold">G-204:</span> Academic Quad Loop</li>
              <li><span className="text-emerald-500 font-bold">S-305:</span> Hostels & Sports Shuttle</li>
              <li><span className="text-purple-500 font-bold">M-410:</span> Metro & City Transit Link</li>
              <li><span className="text-rose-500 font-bold">N-909:</span> Night Owl Safe-Ride</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Support & Dispatch
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-500" />
                <span>Transit Hotline: <strong>(555) 019-RIDE</strong></span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Night Safe-Ride: <strong>(555) 019-SAFE</strong></span>
              </li>
              <li className="flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Campus Lost & Found Desk</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Fleet System Status
            </h4>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 space-y-2">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Telemetry Nodes Live</span>
              </div>
              <div className="text-[11px] text-slate-400">
                GPS telemetry refresh rate: 3 seconds. Powered by Campus IoT Transit Hub.
              </div>
            </div>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div>
            © {new Date().getFullYear()} RidePulse • University Campus Transport Operations
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with precision for campus commuters</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

