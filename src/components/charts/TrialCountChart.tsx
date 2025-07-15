import { Bar, BarChart } from 'recharts';

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
  clinicalTrials: {
    label: 'Clinical Trials (US)',
    color: '#2563eb',
  },
  eudract: {
    label: 'EUDRACT (EU)',
    color: '#60a5fa',
  },
} satisfies ChartConfig;

export default function TrialCount() {
  const { data } = useStudyData();

  const chartData = useMemo(() => {
    return [
      {
        source: 'Trial Sources',
        clinicalTrials: data?.filter(
          study => study.source === StudySource.CLINICAL_TRIALS
        ).length,
        eudract: data?.filter(study => study.source === StudySource.EUDRACT)
          .length,
      },
    ];
  }, [data]);

  return (
    <StudyChartContainer title="Trial counts">
      <ChartContainer config={chartConfig} className="h-[250px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <Bar
            dataKey="clinicalTrials"
            fill="var(--color-clinicalTrials)"
            radius={4}
          />
          <Bar dataKey="eudract" fill="var(--color-eudract)" radius={4} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
