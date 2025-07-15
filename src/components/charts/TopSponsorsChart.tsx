import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import StudyChartContainer from '../study-chart-container';
import useStudyData from '@/hooks/use-study-data';
import { useMemo } from 'react';

const chartConfig = {
  count: {
    label: 'Number of Trials',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

const N_SPONSORS = 10;

export default function TopSponsorsChart() {
  const { data } = useStudyData();

  const chartData = useMemo(() => {
    if (!data) return [];

    const sponsorCounts = data.reduce(
      (acc, study) => {
        acc[study.sponsor] = (acc[study.sponsor] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(sponsorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, N_SPONSORS)
      .map(([sponsor, count]) => ({
        sponsor:
          sponsor.length > 20 ? sponsor.substring(0, 20) + '...' : sponsor,
        count,
      }));
  }, [data]);

  return (
    <StudyChartContainer title={`Top ${N_SPONSORS} Sponsors`}>
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="horizontal"
          margin={{ left: 50 }}
        >
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="sponsor"
            width={150}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
          />
          <Bar dataKey="count" fill="var(--color-count)" radius={4} />

          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
