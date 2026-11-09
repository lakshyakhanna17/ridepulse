# 🚌 RidePulse — Campus Transport Tracker

> Real-time student mobility platform for university campus buses and shuttles. Solves transit uncertainty with live countdowns, route schedules, vehicle capacity tracking, and crowdsourced delay alerts.

![RidePulse Preview](https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80)

---

## ✨ Key Features

1. **⏱️ Real-Time Estimated Arrivals (ETA)**
   - Live countdown timers (e.g. `Arriving in 2 mins`, `Approaching Now`).
   - Dynamic trajectory bar displaying vehicle progress between current and upcoming stops.
   - Live telemetry heartbeat with configurable simulation speed (1x / 2x).

2. **👥 Passenger Capacity & Crowding Gauge**
   - Real-time seat occupancy gauge (e.g., `31 / 45 Seats Filled`).
   - Standing room indicators and crowding status badges:
     - 🟢 **Seats Available** (< 60% capacity)
     - 🟡 **Moderate Crowding** (60% – 85% capacity)
     - 🔴 **Standing Room Only** (> 85% capacity)
   - Hourly campus rush trends and peak-hour heatmaps (07:00 – 21:00) with smart commute tips.

3. **🗺️ Interactive Vector Campus Map**
   - High-fidelity interactive vector map highlighting all campus zones (North Gate Tech, Central Library Quad, Residential Hostels, Sports Arena, Metro Interchange).
   - Real-time moving shuttle markers with vehicle tags and directional headings.
   - Clickable campus stops showing incoming shuttles and stop amenities (EV charging, covered shelters, Wi-Fi).

4. **📅 Route Schedules & Timetables**
   - Comprehensive matrix for all lines: North Campus Express (B-101), Academic Quad Loop (G-204), Hostels & Sports Shuttle (S-305), Metro Connector (M-410), Night Owl Safe-Ride (N-909).
   - Weekday vs. Weekend operational frequencies.
   - Printable timetable export.

5. **⚠️ Live Delay & Incident Reporting (Crowdsourced)**
   - Top banner for active traffic delays, roadwork slowdowns, and weather advisories.
   - Student confirmation voting system to verify real-time status.
   - Interactive **"Report Delay"** modal allowing students to broadcast new incidents that update fleet ETAs instantly.

6. **🧭 Point-to-Point Trip Planner**
   - Select origin and destination stops to find optimal shuttles, walking distances, and transfer tips.

7. **🌙 Dark & Light Mode Support**
   - Sleek design with glassmorphic cards and persistent dark/light theme toggle.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18.0 or higher)
- npm or pnpm

### Installation

```bash
# Clone the repository (or navigate into folder)
cd ridepulse

# Install dependencies
npm install

# Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 🛠️ Building for Production

```bash
# Create optimized production build in /dist
npm run build

# Preview the production build locally
npm run preview
```

---

## 🌐 One-Click Deployment

### Deploy to Vercel
1. Push this repository to GitHub / GitLab.
2. Import project into [Vercel](https://vercel.com).
3. The included `vercel.json` will automatically configure build settings (`npm run build`, output: `dist`).

### Deploy to Netlify
1. Connect repository in Netlify.
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📦 Tech Stack
- **Framework:** React 18
- **Bundler:** Vite 6
- **Styling:** Tailwind CSS 3
- **Icons:** Lucide React
- **State Management:** React Context API + LocalStorage persistence

