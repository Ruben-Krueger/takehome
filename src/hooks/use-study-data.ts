import type { StudyData } from 'shared/types';
import { StudySource } from 'shared/types';
import parseStudyData from './parseStudyData';
import { useState, useEffect, useMemo } from 'react';
import { useFilters } from '@/contexts/FiltersContext';

type StudyDataResponse = {
  data: StudyData[] | null;
  loading: boolean;
  error?: unknown;
  refetch: () => Promise<void>;
};
let studyData: null | StudyData[] = null;

export default function useStudyData(): StudyDataResponse {
  const [loading, setLoading] = useState(true);
  const [rawData, setRawData] = useState<StudyData[] | null>(null);
  const [error, setError] = useState<unknown>();

  const { filters } = useFilters();

  const filteredData = useMemo(() => {
    if (!rawData) return null;

    return rawData.filter((study) => {
      // Region filter
      if (filters.region === 'us' && study.source !== StudySource.CLINICAL_TRIALS) {
        return false;
      }
      if (filters.region === 'eu' && study.source !== StudySource.EUDRACT) {
        return false;
      }

      // Condition search filter
      if (filters.conditionSearch) {
        const searchTerm = filters.conditionSearch.toLowerCase();
        const hasMatchingCondition = study.conditions.some(condition =>
          condition.toLowerCase().includes(searchTerm)
        );
        if (!hasMatchingCondition) {
          return false;
        }
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const studyStartDate = new Date(study.startISO);
        
        if (filters.dateRange.from && studyStartDate < filters.dateRange.from) {
          return false;
        }
        
        if (filters.dateRange.to && studyStartDate > filters.dateRange.to) {
          return false;
        }
      }

      return true;
    });
  }, [rawData, filters]);

  const loadData = async () => {
    try {
      const result = await parseStudyData();
      studyData = result; // Cache for singleton
      setRawData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check singleton first
    if (studyData) {
      setRawData(studyData);
      setLoading(false);
      return;
    }

    // Load data
    loadData();
  }, []);

  return { data: filteredData, loading, error, refetch: loadData };
}
