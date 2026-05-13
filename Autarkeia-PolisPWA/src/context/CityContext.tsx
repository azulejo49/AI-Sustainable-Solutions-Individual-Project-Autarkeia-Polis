import React, { createContext, useContext, useState, ReactNode } from 'react';

export type StructureType = 'agro_alley' | 'chinampa' | 'badgir' | 'battery' | 'windmill' | 'tram_route' | 'cycle_route' | 'animal_husbandry' | 'solar_field' | 'water_reservoir';

export type Structure = { 
  id: string; 
  type: StructureType; 
  lat: number; 
  lng: number; 
  status: string;
};

export interface CityState {
  resources: { energy: number; water: number; food: number; biochar: number };
  structures: Structure[];
  addStructure: (structure: Omit<Structure, 'id'>) => void;
  removeStructure: (id: string) => void;
  updateStructureStatus: (type: StructureType, status: string) => void;
  updateResources: (deltas: Partial<CityState['resources']>) => void;
  clearState: () => void;
}

const CityContext = createContext<CityState | undefined>(undefined);

export function CityProvider({ children }: { children: ReactNode }) {
  const [resources, setResources] = useState({ energy: 85, water: 1400, food: 350, biochar: 2400 }); // Units: %, L, Kg, Kg
  const [structures, setStructures] = useState<Structure[]>([
    { id: 'start-1', type: 'badgir', lat: 34.0500, lng: -118.2500, status: 'Active (Cooling)' },
    { id: 'start-2', type: 'chinampa', lat: 34.0550, lng: -118.2430, status: 'Maturing' },
    { id: 'start-3', type: 'battery', lat: 34.0400, lng: -118.2600, status: 'Charging (92%)' },
  ]);

  const addStructure = (s: Omit<Structure, 'id'>) => {
    setStructures(prev => [...prev, { ...s, id: Math.random().toString(36).substr(2, 9) }]);
  };
  
  const removeStructure = (id: string) => {
    setStructures(prev => prev.filter(st => st.id !== id));
  };
  
  const updateStructureStatus = (type: StructureType, status: string) => {
    setStructures(prev => prev.map(st => st.type === type ? { ...st, status } : st));
  };

  const updateResources = (deltas: Partial<CityState['resources']>) => {
    setResources(prev => ({
      energy: Math.min(100, Math.max(0, prev.energy + (deltas.energy || 0))),
      water: Math.max(0, prev.water + (deltas.water || 0)),
      food: Math.max(0, prev.food + (deltas.food || 0)),
      biochar: Math.max(0, prev.biochar + (deltas.biochar || 0)),
    }));
  };

  const clearState = () => {
     setStructures([]);
     setResources({ energy: 50, water: 500, food: 100, biochar: 0 });
  }

  return (
    <CityContext.Provider value={{ resources, structures, addStructure, removeStructure, updateStructureStatus, updateResources, clearState }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  const context = useContext(CityContext);
  if (!context) throw new Error('useCity must be used within CityProvider');
  return context;
}
