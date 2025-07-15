import { Legend, Line, LineChart, Tooltip, XAxis, YAxis } from 'recharts';

import StudyChartContainer from '../study-chart-container';
import useStudyData from '@/hooks/use-study-data';
import { useMemo } from 'react';

export default function StartDateChart() {
  const { data } = useStudyData();

  const chartData = useMemo(() => {
    if (!data) return [];

    let minYear = 2025;
    let maxYear = 0;

    const yearCounts = data.reduce(
      (acc, study) => {
        const year = new Date(study.startISO).getFullYear();

        if (isNaN(year)) return acc;

        minYear = Math.min(minYear, year);
        maxYear = Math.max(maxYear, year);

        acc[year] = (acc[year] || 0) + 1;
        return acc;
      },
      {} as Record<number, number>
    );

    const yearRange = Array.from(
      { length: maxYear - minYear + 1 },
      (_, index) => minYear + index
    );

    const flattenedYears = yearRange.map(year => ({
      year: year.toString(),
      count: yearCounts[year] || 0,
    }));

    return flattenedYears;
  }, [data]);

  console.log(chartData);

  return (
    <StudyChartContainer title="Start dates">
      <LineChart
        width={730}
        height={250}
        data={chartData}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <XAxis dataKey="year" />
        <YAxis dataKey="count" />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="count" stroke="#2563eb" />
      </LineChart>
    </StudyChartContainer>
  );
}
