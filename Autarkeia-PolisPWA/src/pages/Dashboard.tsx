import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Leaf, Wind, Battery, Droplets, Activity,
  Map as MapIcon, Cpu, ArrowRight, Send, Loader2
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { GoogleGenAI } from '@google/genai';
import { cn } from '../lib/utils';
import { useCity } from '../context/CityContext';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import 'leaflet/dist/leaflet.css';

// Fix leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const goldIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const energyData = [
  { time: '00:00', solar: 0, wind: 400, battery: 800 },
  { time: '04:00', solar: 0, wind: 350, battery: 600 },
  { time: '08:00', solar: 100, wind: 200, battery: 500 },
  { time: '12:00', solar: 900, wind: 100, battery: 700 },
  { time: '16:00', solar: 600, wind: 300, battery: 900 },
  { time: '20:00', solar: 100, wind: 500, battery: 850 },
  { time: '24:00', solar: 0, wind: 450, battery: 750 },
];

export default function Dashboard() {
  const { resources, structures } = useCity();
  
  const tramSegments = useMemo(() => {
    const positions = structures.filter(s => s.type === 'tram_route').map(s => [s.lat, s.lng] as [number, number]);
    const segments: [number, number][][] = [];
    for (let i = 0; i < positions.length; i += 2) {
      if (i + 1 < positions.length) {
        segments.push([positions[i], positions[i + 1]]);
      }
    }
    return segments;
  }, [structures]);

  const cycleSegments = useMemo(() => {
    const positions = structures.filter(s => s.type === 'cycle_route').map(s => [s.lat, s.lng] as [number, number]);
    const segments: [number, number][][] = [];
    for (let i = 0; i < positions.length; i += 2) {
      if (i + 1 < positions.length) {
        segments.push([positions[i], positions[i + 1]]);
      }
    }
    return segments;
  }, [structures]);
  
  return (
    <div className="space-y-6 pb-20">
      <header className="mb-4 pl-2">
        <h2 className="text-4xl font-serif font-black text-stone-900 tracking-tight">City Biosphere</h2>
        <p className="text-stone-500 mt-2 font-medium">Bento grid telemetry from Autarkeia-Polis environmental sensors.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[180px]">
        {/* Row 1-2 */}
        {/* 1. Energy (2 cols, 2 rows) */}
        <div className="md:col-span-2 row-span-2 bg-white rounded-[2.5rem] p-8 border border-stone-200/60 shadow-sm flex flex-col group hover:shadow-md transition-shadow">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 shrink-0 gap-4">
            <div>
               <h3 className="text-xl font-black text-stone-800 flex items-center gap-3">
                 <div className="p-2 bg-amber-100 rounded-2xl text-amber-600"><Activity className="w-5 h-5" /></div>
                 Energy Equilibrium
               </h3>
            </div>
            <div className="flex gap-4 text-xs font-bold text-stone-500 bg-stone-50 px-4 py-2.5 rounded-2xl border border-stone-100 w-fit">
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Solar</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-blue-400" /> Wind</span>
              <span className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Battery</span>
            </div>
          </div>
          <div className="w-full h-[220px] mt-4 relative">
            <ResponsiveContainer width="99%" height={220}>
              <AreaChart data={energyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSolar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWind" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f3f4f6" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12, fontWeight: 600}} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#fff', borderRadius: '20px', border: '1px solid #e5e7eb', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold', padding: '12px' }}
                  />
                  <Area type="monotone" dataKey="solar" stroke="#fbbf24" strokeWidth={3} fillOpacity={1} fill="url(#colorSolar)" />
                  <Area type="monotone" dataKey="wind" stroke="#60a5fa" strokeWidth={3} fillOpacity={1} fill="url(#colorWind)" />
                  <Area type="monotone" dataKey="battery" stroke="#10b981" strokeWidth={3} fill="none" strokeDasharray="6 6" />
                </AreaChart>
              </ResponsiveContainer>
          </div>
        </div>

        {/* 2. AI Overseer (2 cols, 2 rows) */}
        <AIOverseerWidget className="md:col-span-2 row-span-2" />

        {/* Row 3-4 */}
        {/* 3. 3D Map of the City (2 cols, 2 rows) */}
        <div className="md:col-span-2 row-span-2 bg-stone-900 rounded-[2.5rem] border border-stone-800 shadow-sm overflow-hidden relative group p-1 flex flex-col items-center justify-center">
            <div className="absolute top-4 xl:top-6 left-6 z-[100] text-white">
                <h3 className="text-xl font-black flex items-center gap-2 drop-shadow-md">
                   <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                   3D Topology Engine
                </h3>
            </div>
            
            {/* CSS-based 3D City visual */}
            <div className="relative w-full h-[300px] flex items-center justify-center" style={{ perspective: '1000px' }}>
                <div 
                  className="w-[280px] h-[280px] relative transition-transform duration-[3000ms] ease-linear group-hover:[transform:rotateX(72deg)_rotateZ(45deg)]"
                  style={{ transformStyle: 'preserve-3d', transform: 'rotateX(60deg) rotateZ(45deg)' }}
                >
                   {/* Grid Base */}
                   <div className="absolute inset-0 bg-emerald-950 border border-emerald-500/50 rounded-xl" style={{ boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }}>
                      <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.2) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                   </div>

                   {/* Blocks / Structures */}
                   <div className="absolute top-10 left-10 w-12 h-12 bg-amber-500/80 border border-amber-300" style={{ transform: 'translateZ(24px)' }}></div>
                   <div className="absolute top-10 left-10 w-12 h-12 bg-amber-600/90 origin-bottom" style={{ transform: 'translateY(-24px) rotateX(90deg)' }}></div>
                   <div className="absolute top-10 left-10 w-12 h-12 bg-amber-400/90 origin-right" style={{ transform: 'translateX(24px) rotateY(90deg)' }}></div>

                   <div className="absolute top-32 left-16 w-16 h-8 bg-blue-500/80 border border-blue-300" style={{ transform: 'translateZ(10px)' }}></div>
                   
                   <div className="absolute top-20 right-20 w-8 h-20 bg-emerald-500/80 border border-emerald-300" style={{ transform: 'translateZ(40px)' }}></div>
                   <div className="absolute top-20 right-20 w-8 h-20 bg-emerald-600/90 origin-bottom" style={{ transform: 'translateY(-40px) rotateX(90deg)' }}></div>
                   <div className="absolute top-20 right-20 w-8 h-20 bg-emerald-400/90 origin-right" style={{ transform: 'translateX(16px) rotateY(90deg)' }}></div>
                   
                   {/* Windmill lines */}
                   <div className="absolute bottom-16 right-10 w-4 h-4 rounded-full bg-stone-300 animate-spin" style={{ transform: 'translateZ(60px)' }}>
                      <div className="w-10 h-1 bg-stone-200 absolute top-1.5 -left-3 rounded" />
                      <div className="w-1 h-10 bg-stone-200 absolute -top-3 left-1.5 rounded" />
                   </div>
                   <div className="absolute bottom-16 right-10 w-4 h-4 bg-stone-500" style={{ transform: 'translateZ(30px)' }}></div>
                </div>
            </div>
            
            <div className="absolute bottom-6 w-full px-6 flex justify-between items-end">
               <div className="text-stone-400 text-xs font-mono">Render: WebGL Fallback<br/>Physics: Live</div>
               <button className="bg-white/10 hover:bg-white/20 text-white rounded-xl px-4 py-2 border border-white/20 text-sm font-semibold transition-colors backdrop-blur-md">
                   Enter 3D View
               </button>
            </div>
        </div>

        {/* 4. Map Box (2 cols, 2 rows) */}
        <div className="md:col-span-2 row-span-2 bg-white rounded-[2.5rem] border border-stone-200/60 shadow-sm overflow-hidden relative group p-2">
           <div className="w-full h-full rounded-[2rem] overflow-hidden relative isolate">
             <div className="absolute top-4 left-4 z-[1000] bg-white/80 backdrop-blur-xl px-4 py-3 rounded-2xl shadow-sm border border-white flex items-center gap-2.5 font-black text-stone-800 text-sm hover:scale-105 transition-transform cursor-pointer">
                <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-600"><MapIcon className="w-4 h-4" /></div>
                Spatial Planner Tracker
             </div>
             <MapContainer center={[34.0522, -118.2437]} zoom={14} className="w-full h-full" zoomControl={false} dragging={false} scrollWheelZoom={false}>
                <TileLayer
                  attribution='&copy; OSM'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {structures.map((s) => {
                  let icon;
                  switch(s.type) {
                    case 'agro_alley': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'chinampa': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'badgir': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'battery': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'windmill': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'tram_route': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'cycle_route': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'animal_husbandry': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'solar_field': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    case 'water_reservoir': icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                    default: icon = new L.Icon({ iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png', iconSize: [25, 41], iconAnchor: [12, 41] }); break;
                  }
                  return <Marker key={s.id} position={[s.lat, s.lng]} icon={icon} />
                })}

                {tramSegments.map((seg, i) => (
                  <Polyline key={`tram-seg-${i}`} positions={seg} color="#8b5cf6" weight={4} dashArray="8, 8" opacity={0.8} />
                ))}

                {cycleSegments.map((seg, i) => (
                  <Polyline key={`cycle-seg-${i}`} positions={seg} color="#eab308" weight={4} opacity={0.8} />
                ))}
             </MapContainer>
           </div>
        </div>

        {/* Row 5: 1x1 Stats */}
        {/* 5. Battery Stat (1x1) */}
        <StatCard 
          icon={<Battery />} bgMain="bg-amber-50/50" iconColor="text-amber-600"
          title="Eco-Battery Storage" value={resources.energy + "%"} trend="Live Telemetry" trendColor="text-amber-700 border-amber-200"
        />

        {/* 6. Water Stat (1x1) */}
        <StatCard 
          icon={<Droplets />} bgMain="bg-blue-50/60" iconColor="text-blue-600"
          title="Qanat Water Reserves" value={resources.water + " L"} trend="Steady Flow" trendColor="text-blue-700 border-blue-200"
        />

        {/* 7. Biochar Stat (1x1) */}
        <StatCard 
          icon={<Leaf />} bgMain="bg-emerald-50/60" iconColor="text-emerald-600"
          title="Biochar Production" value={resources.biochar + " Kg"} trend="Active Pyrolysis" trendColor="text-emerald-700 border-emerald-200"
        />

        {/* 8. Cooling Stat (1x1) */}
        <StatCard 
          icon={<Wind />} bgMain="bg-stone-100/80" iconColor="text-stone-600"
          title="Passive Cooling" value={structures.filter(s => s.type === 'badgir').length + " Active"} trend="Badgirs Deployed" trendColor="text-stone-700 border-stone-200"
        />

      </div>
    </div>
  );
}

function StatCard({ 
  icon, title, value, trend, trendColor, bgMain, iconColor, className
}: any) {
  return (
    <div className={cn("rounded-[2.5rem] p-5 lg:p-6 shadow-sm border border-stone-200/50 flex flex-col justify-between group overflow-hidden relative cursor-pointer hover:-translate-y-1 hover:shadow-md transition-all duration-300", bgMain, className)}>
       <div className="flex items-center justify-between z-10 relative">
          <div className="p-2.5 bg-white/70 backdrop-blur-md rounded-[1rem] shadow-sm border border-white text-stone-700">
             {React.cloneElement(icon, { className: "w-5 h-5 " + iconColor })}
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
       </div>
       <div className="z-10 relative mt-2">
          <p className="text-sm font-bold tracking-wide text-stone-500 mb-0.5">{title}</p>
          <h4 className="text-3xl leading-none font-black text-stone-900 tracking-tight">{value}</h4>
          <p className={cn("text-[10px] font-black mt-2 inline-flex items-center px-2 py-1 rounded-lg bg-white/70 backdrop-blur-sm shadow-sm uppercase tracking-wider", trendColor)}>
            {trend}
          </p>
       </div>
       <div className="absolute -bottom-8 -right-8 opacity-[0.035] transform group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 pointer-events-none">
         {React.cloneElement(icon, { className: "w-40 h-40" })}
       </div>
    </div>
  )
}

function AIOverseerWidget({ className }: { className?: string }) {
  const { resources, structures, updateResources, updateStructureStatus } = useCity();
  const [messages, setMessages] = useState<{role: 'user'|'model', content: string}[]>([
    { role: 'model', content: 'City equilibrium stable. Awaiting telemetry injection.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      if (!process.env.GEMINI_API_KEY) throw new Error('GEMINI_API_KEY missing - add it to .env');
      
      const cityState = JSON.stringify({ resources, structures: structures.length });

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const responseStream = await ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { 
          systemInstruction: `You are the Digital Overseer of Autarkeia-Polis. Current status: ${cityState}.
If the user asks you to take physical action (like harvesting, building, adjusting cooling), output a JSON block ANYWHERE in your response like this exactly:
\`\`\`json
{ "action": "harvest", "target": "chinampa", "amount": 50 }
\`\`\`
Actions: harvest (adds food), charge (adds energy), dump (uses water).
Reply concisely emphasizing the adjustments you are making in a few short sentences.` 
        }
      }).sendMessageStream({ message: userMsg });

      setMessages(prev => [...prev, { role: 'model', content: '' }]);
      let full = '';
      for await (const chunk of responseStream) {
        full += (chunk as any).text || '';
        setMessages(prev => {
          const arr = [...prev];
          arr[arr.length - 1].content = full;
          return arr;
        });
      }

      // Very simple action parsing hook for the widget
      if (full.includes('```json')) {
        try {
           const jsonStr = full.split('```json')[1].split('```')[0].trim();
           const actionData = JSON.parse(jsonStr);
           if (actionData.action === 'harvest') {
              updateResources({ food: actionData.amount || 100 });
              if (actionData.target) {
                updateStructureStatus(actionData.target, 'Harvested');
              }
           }
        } catch (e) {
           console.log("Failed to parse AI action");
        }
      }

    } catch(err: any) {
      setMessages(prev => [...prev, { role: 'model', content: `System Error: ${err.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("bg-stone-900 rounded-[2.5rem] p-7 shadow-sm flex flex-col relative overflow-hidden group border border-stone-800", className)}>
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-[64px] group-hover:bg-emerald-500/20 transition-colors duration-1000 pointer-events-none" />
      
      <div className="flex items-center gap-4 mb-6 shrink-0 relative z-10">
        <div className="w-12 h-12 rounded-[1.2rem] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
          <Cpu className="text-emerald-400 w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-black text-white tracking-wide leading-tight">Digital Overseer</h3>
          <p className="text-emerald-400/80 text-[11px] font-mono mt-1 font-bold tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-5 mb-5 min-h-[0] pr-3 custom-scrollbar relative z-10 flex flex-col">
        <div className="flex-1" /> {/* Spacer to push messages to bottom */}
        {messages.map((m, i) => (
          <div key={i} className={cn("flex flex-col max-w-[85%]", m.role === 'user' ? "ml-auto" : "mr-auto")}>
            <span className={cn(
              "text-[9px] font-black mb-1.5 uppercase tracking-[0.15em]",
              m.role === 'user' ? "text-stone-500 text-right" : "text-emerald-500/80"
            )}>
              {m.role === 'user' ? 'Telemetry' : 'Governing AI'}
            </span>
            <div className={cn(
               "px-4 py-3 rounded-[1.2rem] text-sm leading-relaxed overflow-hidden",
               m.role === 'user' ? "bg-stone-800 text-stone-200 rounded-tr-sm border border-stone-700/50" : "bg-emerald-950/40 text-emerald-100 border border-emerald-900/50 rounded-tl-sm backdrop-blur-sm shadow-inner",
               m.content.includes('```json') ? "border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]" : ""
            )}>
              <div className={cn(
                "prose prose-sm max-w-none prose-p:my-1 prose-headings:my-2 prose-ul:my-1 bg-transparent", 
                m.role === 'user' ? "text-stone-200" : "prose-invert text-emerald-100 placeholder-emerald-100 prose-headings:text-emerald-50 prose-strong:text-white"
              )}>
                <Markdown remarkPlugins={[remarkGfm]}>
                  {m.content.replace(/```json[\s\S]*?```/, '> ⚡ **Engine Activating Physical Subsystems...**')}
                </Markdown>
              </div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form onSubmit={handleSubmit} className="shrink-0 relative z-10 flex gap-2">
        <input 
          value={input} onChange={e => setInput(e.target.value)}
          placeholder="Inject atmospheric or telemetry data..."
          className="flex-1 bg-stone-800/50 border border-stone-700 rounded-[1.2rem] px-5 py-3 text-sm text-stone-200 font-medium focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 placeholder:text-stone-600 transition-all shadow-inner"
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading||!input} className="bg-emerald-600 hover:bg-emerald-500 text-emerald-50 font-bold w-12 shrink-0 rounded-[1.2rem] flex items-center justify-center transition-colors disabled:opacity-50">
           {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 ml-0.5" />}
        </button>
      </form>
    </div>
  );
}
