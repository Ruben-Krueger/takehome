import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Region } from 'shared/types';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface FilterState {
  region: Region;
  conditionSearch: string;
  dateRange: DateRange;
}

interface FiltersContextType {
  filters: FilterState;
  setRegion: (region: FilterState['region']) => void;
  setConditionSearch: (search: string) => void;
  setDateRange: (range: DateRange) => void;
  resetFilters: () => void;
}

const defaultFilters: FilterState = {
  region: 'all',
  conditionSearch: '',
  dateRange: { from: undefined, to: undefined },
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const setRegion = (region: FilterState['region']) => {
    setFilters(prev => ({ ...prev, region }));
  };

  const setConditionSearch = (conditionSearch: string) => {
    setFilters(prev => ({ ...prev, conditionSearch }));
  };

  const setDateRange = (dateRange: DateRange) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <FiltersContext.Provider
      value={{
        filters,
        setRegion,
        setConditionSearch,
        setDateRange,
        resetFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (context === undefined) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}
