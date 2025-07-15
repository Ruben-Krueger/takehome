import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { StudySource } from 'shared/types';
import StudyChartContainer from '../study-chart-container';
import useStudyData from '@/hooks/use-study-data';
import { useMemo } from 'react';

const chartConfig = {
  count: {
    label: 'Number of Trials',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export default function TrialCount() {
  const { data } = useStudyData();

  const chartData = useMemo(() => {
    if (!data) return [];

    const usCount = data.filter(
      study => study.source === StudySource.CLINICAL_TRIALS
    ).length;

    const euCount = data.filter(
      study => study.source === StudySource.EUDRACT
    ).length;

    return [
      {
        region: 'United States',
        count: usCount,
        fill: '#2563eb',
      },
      {
        region: 'European Union',
        count: euCount,
        fill: '#dc2626',
      },
    ];
  }, [data]);

  return (
    <StudyChartContainer title="Trial counts">
      <ChartContainer config={chartConfig} className=" w-full">
        <BarChart accessibilityLayer data={chartData}>
          <XAxis dataKey="region" />
          <YAxis />
          <Bar dataKey="count" radius={4} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
