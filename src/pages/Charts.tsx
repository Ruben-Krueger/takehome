import StudyChart from '@/components/study-chart';
import useStudyData from '@/hooks/use-study-data';
import type { JSX } from 'react';

// Instructions:
// Add a page accessible via a lefthand side menu bar called “Charts” accessible via /charts. Create a ~10 charts using the csv/json data above with the visualization library of your choice (Recharts, d3.js, charts.js, etc.). These charts should be rendered into the /charts page in a catalog list/ grid and should have its own chartId and chartTitle
// Examples of charts include:
// Total number of clinical trials in ClinicalTrials.gov vs EudraCT (simple numbers are fine)
// Breakdown of clinical trials by conditions (pie chart)
// Breakdown of clinical trials by each sponsor (bar chart, descending order)
// Top 10 Sponsors
// Enrollment totals by region

export default function Charts(): JSX.Element {
  const { data, error, loading } = useStudyData();
  return (
    <div className="flex justify-center items-center">
      <h1 className="text-xl">Charts</h1>
      <div>
        {loading ? (
          <>loading</>
        ) : error ? (
          <>error</>
        ) : data ? (
          <>{JSON.stringify(data)} </>
        ) : null}
        <StudyChart />
      </div>
    </div>
  );
}
