import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '../lib/utils';

const timeline = [
  {
    phase: "Phase 1: Topography & Biological Foundation",
    duration: "Months 1–8",
    status: 'completed',
    items: [
      { title: "Spatial Mapping", desc: "3D GIS scanning to map wind corridors, sunlight angles, and gravity lines for Qanats." },
      { title: "Earthworks & Material Prep", desc: "Mass production of Rammed Earth blocks and excavation of the deep subterranean Walipinis and Stepwells." },
      { title: "Biological Seeding", desc: "Planting the foundational Urban Food Forests, Agroforestry Grain Alleys, and aquatic Chinampas." }
    ]
  },
  {
    phase: "Phase 2: Eco-Construction & Energy Infrastructure",
    duration: "Months 9–18",
    status: 'current',
    items: [
      { title: "Zero-Concrete Architecture", desc: "Erecting Rammed Earth eco-blocks integrated with Trombe walls, Yakhchals, and Windcatchers." },
      { title: "Water & Thermal Routing", desc: "Laying down the Qanats, Stepwells, and Ondol heating pipes." },
      { title: "Renewable Energy Grid", desc: "Installing the decentralized Solar Panels, electrical Wind Turbines, and building the Eco-Battery Storage Fields." }
    ]
  },
  {
    phase: "Phase 3: Sensor Deployment & Biological Maturation",
    duration: "Months 19–26",
    status: 'upcoming',
    items: [
      { title: "Digital Integration", desc: "Deploying the IoT sensor network across the city's soil, water, and energy grids." },
      { title: "Kinetic Infrastructure", desc: "Erecting the direct-labor Mechanical Windmills for water pumping and future gristmilling." },
      { title: "Animal Husbandry & Symbiosis", desc: "Populating Dairy Paddocks and Chicken Silvopastures. Deploying Smart Apiaries." }
    ]
  },
  {
    phase: "Phase 4: Closed-Loop Activation & Full Autarkeia",
    duration: "Months 27–36",
    status: 'upcoming',
    items: [
      { title: "Transit & Logistics", desc: "Finalizing slow-mobility grid, Solar Pod Trams activated and routed by Central AI." },
      { title: "Harvest & Processing", desc: "First major grain harvests are milled using kinetic wind gristmills." },
      { title: "AI Governance", desc: "Central AI assumes full autonomous control. City achieves permanent zero-waste, zero-emission equilibrium." }
    ]
  }
];

export default function Roadmap() {
  return (
    <div className="max-w-4xl pb-20">
      <header className="mb-10">
        <h2 className="text-3xl font-serif font-semibold text-stone-900">36-Month Autarkeia Masterplan</h2>
        <p className="text-stone-500 mt-2 text-lg">Phased implementation roadmap for the zero-energy ancient smart city.</p>
      </header>

      <div className="space-y-8 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-stone-200">
        {timeline.map((phase, i) => (
          <div key={i} className="relative pl-12">
            <div className={cn(
              "absolute left-0 top-1 w-10 h-10 rounded-full border-4 border-stone-50 flex items-center justify-center z-10",
              phase.status === 'completed' ? "bg-emerald-500 text-white" : 
              phase.status === 'current' ? "bg-amber-400 text-white" : "bg-stone-200 text-stone-500"
            )}>
              {phase.status === 'completed' ? <CheckCircle2 className="w-5 h-5 text-white" /> : 
               phase.status === 'current' ? <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" /> :
               <Circle className="w-5 h-5 text-stone-400" />}
            </div>

            <div className={cn(
              "bg-white rounded-xl border p-6 shadow-sm",
              phase.status === 'current' ? "border-amber-200 ring-2 ring-amber-100" : "border-stone-200"
            )}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 pb-4 border-b border-stone-100 gap-2">
                <h3 className="text-xl font-serif font-semibold text-stone-900">{phase.phase}</h3>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-stone-100 text-stone-600 shrink-0">
                  <Calendar className="w-3 h-3" />
                  {phase.duration}
                </span>
              </div>

              <div className="space-y-4 pt-2">
                {phase.items.map((item, j) => (
                  <div key={j} className="flex gap-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-2" />
                    <div>
                      <h4 className="font-semibold text-stone-800 text-sm">{item.title}</h4>
                      <p className="text-sm text-stone-500 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
