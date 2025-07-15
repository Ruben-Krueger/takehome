import type { StudyData } from 'shared/types';
import parseStudyData from './parseStudyData';
import { useState, useEffect } from 'react';

// 7. Type safety:
// - Update return type from StudyData to include loading states
// - Consider union types for different hook states
type StudyDataResponse = {
  data: StudyData[] | null;
  loading: boolean;
  error?: unknown;
  refetch: () => Promise<void>;
};
let studyData: null | StudyData[] = null;

export default function useStudyData(): StudyDataResponse {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudyData[] | null>(null);
  const [error, setError] = useState<unknown>();

  const loadData = async () => {
    try {
      const result = await parseStudyData();
      studyData = result; // Cache for singleton
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check singleton first
    if (studyData) {
      setData(studyData);
      setLoading(false);
      return;
    }

    // Load data
    loadData();
  }, []);

  return { data, loading, error, refetch: loadData };
}
