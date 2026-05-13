# Autarkeia-Polis 🍃
<div align="center">
  <img src="./badge.svg" width="340"/>
</div>
> **Zero-Energy Waste • Self-Sufficient • Smart Ancient City Master-Plan**

Autarkeia-Polis is a centralized dashboard and spatial visualization engine for managing a simulated zero-energy, self-sufficient smart city. Built as an interactive digital twin, it prioritizes ancient passive physics (such as Badgirs and Chinampas) over active electrical energy, maintaining absolute urban equilibrium.

![Autarkeia-Polis Overview](public/vite.svg)

## 📖 Explainer

The "Digital Overseer" (Central AI Governance Engine) is responsible for balancing four crucial resources: Energy, Water, Food, and Biochar. The Autarkeia-Polis application acts as the control center, allowing urban planners and environmental engineers to:
1. **Monitor Live Telemetry:** Track eco-battery reserves, Qanat water flow, and biochar production.
2. **Interact with the AI Overseer:** Discuss autonomous triggers and request simulations via Gemini AI.
3. **Manage Spatial Layout:** Place green infrastructure like Badgirs, Windmills, Aquatic Chinampas, and Solar Fields dynamically onto a 2D/3D map to optimize resource loops.

## ✨ Features

- **Live 3D Topology Engine:** A CSS-based 3D rendered overview of the city core.
- **Interactive Spatial Map (Leaflet):** Drop and connect distinct eco-structures on a live geographic map. Supported infrastructure includes:
  - 🌿 Agroforestry Alleys
  - 💧 Aquatic Chinampas
  - 🌬️ Badgir Windcatchers
  - 🔋 Eco-Battery Storage
  - ⚡ Kinetic Windmills
  - 🚊 Tram/Pod Routes (Auto-connecting)
  - 🚲 Cycle Routes (Auto-connecting)
  - 🐔 Animal Husbandry
  - ☀️ Solar Fields
  - 🌊 Water Reservoirs
- **AI Governance Chat:** Integrated with Google's Gemini AI to assist in balancing the city's resources based on thermodynamic and biological principles.
- **Resource Simulation Engine:** Context-based real-time tracking of city vitality statistics.

## 🏗️ Architecture & Stack

The application is built using a modern, client-side React architecture:

- **Frontend Framework:** React 18 / Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (utility-first, responsive design)
- **State Management:** React Context API (`CityContext`)
- **Mapping Engine:** React-Leaflet (Leaflet.js)
- **Data Visualization:** Recharts (Area charts for energy telemetry)
- **AI Integration:** `@google/genai` (Gemini API for the AI Overseer component)
- **Icons:** `lucide-react`

## 📂 File Structure

```text
autarkeia-polis/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   ├── context/
│   │   └── CityContext.tsx # Centralized state for structures and resources
│   ├── lib/
│   │   └── utils.ts        # Helper functions (e.g., Tailwind class merging)
│   ├── pages/
│   │   ├── Dashboard.tsx   # Main monitoring UI & 3D Topology
│   │   └── SpatialMap.tsx  # Interactive Leaflet map constructor
│   ├── App.tsx             # Application entry point & layout shell
│   ├── index.css           # Global Tailwind CSS entry
│   └── main.tsx            # React DOM rendering
├── package.json            # Scripts & dependencies
├── tailwind.config.js      # Tailwind theme & plugin configurations
└── vite.config.ts          # Vite build tool and plugin configuration
```

## 🚀 Pros & Advantages

1. **Holistic Resource Modeling:** Encourages thinking in closed loops where waste becomes structural input (e.g., Biochar Pyrolysis).
2. **Passive-First Logic:** Forces users to utilize physical mechanics (wind flow, gravity, thermal mass) before resorting to battery dispatch.
3. **AI-Assisted Decisions:** The Overseer engine reduces cognitive load, identifying systemic bottlenecks (like overgrazed paddocks or low reservoir tables) before they fail.
4. **Visually Clear:** Clean, brutalist-inspired UI with high-contrast, color-coded map markers ensures rapid assessment during crisis scenarios.
5. **Highly Extensible:** The context-driven structure makes adding new types of passive technologies (like Trombe walls or Ondol heating) trivial.

## 🛠️ Local Development

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Setup Environment:**
   Duplicate `.env.example` to `.env` and add your Gemini API Key.
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

3. **Run Dev Server:**
   ```bash
   npm run dev
   ```

## 📜 License

All Rights Reserved.

*Designed for the Future. Supported by Ancient Physics.*
