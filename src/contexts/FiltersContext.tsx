import { createContext, useContext, useState, useEffect } from 'react';
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

const STORAGE_KEY = 'study-filters';

const defaultFilters: FilterState = {
  region: 'all',
  conditionSearch: '',
  dateRange: { from: undefined, to: undefined },
};

const loadFiltersFromStorage = (): FilterState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultFilters;

    const parsed = JSON.parse(stored);
    return {
      region: parsed.region || defaultFilters.region,
      conditionSearch: parsed.conditionSearch || defaultFilters.conditionSearch,
      dateRange: {
        from: parsed.dateRange?.from
          ? new Date(parsed.dateRange.from)
          : undefined,
        to: parsed.dateRange?.to ? new Date(parsed.dateRange.to) : undefined,
      },
    };
  } catch {
    return defaultFilters;
  }
};

const saveFiltersToStorage = (filters: FilterState) => {
  try {
    const toStore = {
      ...filters,
      dateRange: {
        from: filters.dateRange.from?.toISOString(),
        to: filters.dateRange.to?.toISOString(),
      },
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const FiltersContext = createContext<FiltersContextType | undefined>(undefined);

export function FiltersProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(loadFiltersFromStorage);

  useEffect(() => {
    saveFiltersToStorage(filters);
  }, [filters]);

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
