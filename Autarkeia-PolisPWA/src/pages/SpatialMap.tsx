import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useCity, StructureType } from '../context/CityContext';
import { Leaf, Wind, Battery, Droplets, Zap, Train, Bike, Bird, Sun, Waves } from 'lucide-react';

// Fix typical Leaflet icon issue in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const createIcon = (color: string) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// For water_reservoir, if lightblue is missing we fallback to cyan or standard blue, but leaflet-color-markers has lightblue
const icons: Record<StructureType, L.Icon> = {
  agro_alley: createIcon('green'),
  chinampa: createIcon('blue'),
  badgir: createIcon('gold'),
  battery: createIcon('orange'),
  windmill: createIcon('grey'),
  tram_route: createIcon('violet'),
  cycle_route: createIcon('yellow'),
  animal_husbandry: createIcon('red'),
  solar_field: createIcon('black'),
  water_reservoir: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
  }),
};

const structInfo: Record<StructureType, { label: string; icon: React.ReactNode; color: string }> = {
  agro_alley: { label: 'Agroforestry Alley', icon: <Leaf className="w-4 h-4"/>, color: '#10b981' },
  chinampa: { label: 'Aquatic Chinampa', icon: <Droplets className="w-4 h-4"/>, color: '#3b82f6' },
  badgir: { label: 'Badgir Windcatcher', icon: <Wind className="w-4 h-4"/>, color: '#f59e0b' },
  battery: { label: 'Eco-Battery Storage', icon: <Battery className="w-4 h-4"/>, color: '#f97316' },
  windmill: { label: 'Kinetic Windmill', icon: <Zap className="w-4 h-4"/>, color: '#6b7280' },
  tram_route: { label: 'Tram/Pod Route', icon: <Train className="w-4 h-4"/>, color: '#8b5cf6' },
  cycle_route: { label: 'Cycle Route', icon: <Bike className="w-4 h-4"/>, color: '#eab308' },
  animal_husbandry: { label: 'Animal Husbandry', icon: <Bird className="w-4 h-4"/>, color: '#ef4444' },
  solar_field: { label: 'Solar Field', icon: <Sun className="w-4 h-4"/>, color: '#171717' },
  water_reservoir: { label: 'Water Reservoir', icon: <Waves className="w-4 h-4"/>, color: '#06b6d4' },
};

export default function SpatialMap() {
  const { structures, addStructure, removeStructure } = useCity();
  const [activeBuilder, setActiveBuilder] = useState<StructureType | null>(null);

  const center: [number, number] = [34.0522, -118.2437]; // Example center

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

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        if (activeBuilder) {
          addStructure({
            type: activeBuilder,
            lat: e.latlng.lat,
            lng: e.latlng.lng,
            status: 'Constructed'
          });
          setActiveBuilder(null);
        }
      },
    });
    return null;
  };

  return (
    <div className="h-[calc(100vh-8rem)] lg:h-[calc(100vh-6rem)] flex flex-col space-y-4 pb-4 md:pb-0">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-serif font-semibold text-stone-900">Spatial Management Constructor</h2>
          <p className="text-stone-500 mt-1">Select an infrastructure type and click on the map to build.</p>
        </div>
      </header>

      {/* Build Toolbar */}
      <div className="flex gap-2 bg-white p-2 rounded-xl border border-stone-200 shadow-sm overflow-x-auto">
         {(Object.keys(structInfo) as StructureType[]).map((type) => {
            const info = structInfo[type];
            const isActive = activeBuilder === type;
            return (
              <button
                key={type}
                onClick={() => setActiveBuilder(isActive ? null : type)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  isActive ? 'bg-emerald-100 text-emerald-800 border-emerald-300 border' : 'bg-stone-50 text-stone-600 border border-stone-100 hover:bg-stone-100'
                }`}
              >
                {info.icon}
                {info.label}
              </button>
            )
         })}
         {activeBuilder && (
           <div className="ml-auto px-4 py-2 text-sm text-emerald-600 animate-pulse font-medium bg-emerald-50 rounded-lg flex items-center">
             Click map to place {structInfo[activeBuilder].label}...
           </div>
         )}
      </div>

      <div className={`flex-1 bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm relative z-0 ${activeBuilder ? 'cursor-crosshair' : ''}`}>
        <MapContainer center={center} zoom={14} className="h-full w-full" zoomControl={false}>
          <MapEvents />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {structures.map((s) => (
             <Marker key={s.id} position={[s.lat, s.lng]} icon={icons[s.type]}>
               <Popup>
                 <div className="min-w-[150px]">
                   <h3 className="font-bold text-stone-800 border-b pb-1 mb-1">{structInfo[s.type].label}</h3>
                   <p className="text-sm text-stone-600 mt-1">Status: <span className="font-medium text-emerald-600">{s.status}</span></p>
                   <button 
                     onClick={(e) => { e.stopPropagation(); removeStructure(s.id); }}
                     className="mt-2 w-full text-xs text-rose-500 hover:text-rose-600 font-medium py-1.5 hover:bg-rose-50 rounded transition-colors border border-transparent hover:border-rose-100"
                   >
                     Remove Structure
                   </button>
                 </div>
               </Popup>
             </Marker>
          ))}
          
          {tramSegments.map((seg, i) => (
            <Polyline key={`tram-seg-${i}`} positions={seg} color={structInfo['tram_route'].color} weight={4} dashArray="8, 8" opacity={0.8} />
          ))}

          {cycleSegments.map((seg, i) => (
            <Polyline key={`cycle-seg-${i}`} positions={seg} color={structInfo['cycle_route'].color} weight={4} opacity={0.8} />
          ))}
          
        </MapContainer>
        
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur p-4 rounded-lg border border-stone-200 shadow-md z-[1000] space-y-2 text-sm pointer-events-none">
          <h4 className="font-semibold text-stone-800 mb-2">Map Legend</h4>
          {Object.entries(structInfo).map(([type, info]) => (
            <div key={type} className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full" style={{ backgroundColor: info.color }} />
               <span className="text-stone-600">{info.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
