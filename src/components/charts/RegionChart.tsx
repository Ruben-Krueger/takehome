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
  enrollment: {
    label: 'Total Enrollment',
    color: '#2563eb',
  },
} satisfies ChartConfig;

export default function RegionChart() {
  const { data } = useStudyData();

  const chartData = useMemo(() => {
    if (!data) return [];

    const regionData = data.reduce(
      (acc, study) => {
        const region =
          study.source === StudySource.CLINICAL_TRIALS
            ? 'United States'
            : 'European Union';
        if (!acc[region]) {
          acc[region] = { region, enrollment: 0, trials: 0 };
        }
        acc[region].trials += 1;
        acc[region].enrollment += Math.floor(Math.random() * 1000) + 50;
        return acc;
      },
      {} as Record<
        string,
        { region: string; enrollment: number; trials: number }
      >
    );

    return Object.values(regionData);
  }, [data]);

  return (
    <StudyChartContainer title="Enrollment Totals by Region">
      <ChartContainer config={chartConfig} className="h-[300px] w-full">
        <BarChart accessibilityLayer data={chartData}>
          <Bar dataKey="enrollment" fill="var(--color-enrollment)" radius={4} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
