import type { StudyData } from 'shared/types';
import parseStudyData from './parseStudyData';

//

// 4. Performance patterns:
// - Only fetch once per app lifecycle
// - Use useCallback for any returned functions
// - Consider useMemo for expensive data transformations

// 5. CSV loading in browser:
// - Place CSV in public/ folder for client access
// - Or use dynamic imports if bundling the data

// 6. Error handling:
// - Wrap fetch/parse in try-catch
// - Provide meaningful error states

// 7. Type safety:
// - Update return type from StudyData to include loading states
// - Consider union types for different hook states

interface StudyDataResponse {
  data: StudyData[] | null;
  loading: boolean;
  error?: unknown;
  refetch: () => void;
}

let studyData: null | StudyData[] = null;

import { useState, useEffect } from 'react';

export default function useStudyData(): StudyDataResponse {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StudyData[] | null>(null);
  const [error, setError] = useState<unknown>();

  const loadData = async () => {
    try {
      const result = await parseStudyData('/ctg-studies.csv');
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
