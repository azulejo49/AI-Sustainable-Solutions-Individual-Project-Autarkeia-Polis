import { useState } from 'react';
import { 
  Building2, 
  Map as MapIcon, 
  Cpu, 
  Milestone, 
  Menu,
  X
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import SpatialMap from './pages/SpatialMap';
import AIOverseer from './pages/AIOverseer';
import Roadmap from './pages/Roadmap';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'map' | 'ai' | 'roadmap'>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const tabs = [
    { id: 'dashboard', label: 'System Overview', icon: Building2 },
    { id: 'map', label: 'Spatial Planner', icon: MapIcon },
    { id: 'ai', label: 'Digital Overseer AI', icon: Cpu },
    { id: 'roadmap', label: '36-Month Roadmap', icon: Milestone },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'map': return <SpatialMap />;
      case 'ai': return <AIOverseer />;
      case 'roadmap': return <Roadmap />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#FDFBF7] text-stone-800 font-sans selection:bg-emerald-200">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-stone-900/50 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-stone-900 text-stone-100 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 border-r border-stone-800 flex flex-col",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center gap-3 justify-between mb-8">
            <div className="flex items-center gap-3">
              <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="text-emerald-400">
                  <path fill="currentColor" d="M255.563 22.094c-126.81 0-229.594 102.784-229.594 229.594 0 25.4 4.132 49.846 11.75 72.687 40.154-24.203 76.02-41.17 107.56-52.03-35.752 5.615-66.405 23.66-109.843 4 31.552-27.765 87.682-65.842 138.532-71.658 26.58-21.615 68.113-43.962 89.655-37.28 30.492-26.873 67.982-61.093 108.125-85.75 10.667 16.156 17.124 35.94 12.563 57.874-80.37 20.205-61.692 148.928 13.468 67.44 6.348 13.064 9.41 26.665 9.095 41.436-32.675 33.83-66.97 63.026-101.938 87.906.466 23.99-5.605 52.915-19 84.813-5.635 13.42-7.33 36.406 22.875 53.97 101.14-24.012 176.375-114.924 176.375-223.408 0-126.81-102.815-229.593-229.625-229.593zm3.312 164.375c-17.835 2.22-32.794 9.046-45.844 18.968 12.083-.036 25.612 2.882 37.5 6.156 6.208-6.698 10.236-18.52 8.345-25.125z"/>
              </svg>
              <h1 className="text-xl font-serif font-bold tracking-tight text-emerald-400">
                Autarkeia-Polis
              </h1>
            </div>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
              <X className="w-6 h-6 text-stone-400" />
            </button>
          </div>
          <p className="text-sm text-stone-400 mb-8 font-mono">
            Zero-Energy Waste • Self-Sufficient • Smart Ancient City • Master-Plan
          </p>

          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full px-4 py-3 text-left rounded-lg transition-colors group",
                    activeTab === tab.id 
                      ? "bg-emerald-900/40 text-emerald-300 border border-emerald-800/50" 
                      : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 mr-3 transition-colors",
                    activeTab === tab.id ? "text-emerald-400" : "text-stone-500 group-hover:text-stone-300"
                  )} />
                  <span className="font-medium tracking-wide text-sm">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-stone-800">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-900/50 flex items-center justify-center border border-emerald-800">
                <Cpu className="w-5 h-5 text-emerald-400" />
             </div>
             <div>
                <div className="text-xs text-stone-400 font-mono">STATUS</div>
                <div className="text-sm font-medium text-emerald-400 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  System Online
                </div>
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-stone-50">
        <header className="h-16 md:hidden flex items-center justify-between px-4 border-b border-stone-200 bg-white shadow-sm z-40">
          <div className="flex items-center gap-2">
            <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="text-emerald-500">
                <path fill="currentColor" d="M255.563 22.094c-126.81 0-229.594 102.784-229.594 229.594 0 25.4 4.132 49.846 11.75 72.687 40.154-24.203 76.02-41.17 107.56-52.03-35.752 5.615-66.405 23.66-109.843 4 31.552-27.765 87.682-65.842 138.532-71.658 26.58-21.615 68.113-43.962 89.655-37.28 30.492-26.873 67.982-61.093 108.125-85.75 10.667 16.156 17.124 35.94 12.563 57.874-80.37 20.205-61.692 148.928 13.468 67.44 6.348 13.064 9.41 26.665 9.095 41.436-32.675 33.83-66.97 63.026-101.938 87.906.466 23.99-5.605 52.915-19 84.813-5.635 13.42-7.33 36.406 22.875 53.97 101.14-24.012 176.375-114.924 176.375-223.408 0-126.81-102.815-229.593-229.625-229.593zm3.312 164.375c-17.835 2.22-32.794 9.046-45.844 18.968 12.083-.036 25.612 2.882 37.5 6.156 6.208-6.698 10.236-18.52 8.345-25.125z"/>
            </svg>
            <h1 className="text-xl font-serif font-bold text-stone-900">Autarkeia-Polis</h1>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)}>
            <Menu className="w-6 h-6 text-stone-600" />
          </button>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
