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
    color: '#2563eb',
  },
} satisfies ChartConfig;

export default function SponsorsChart() {
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
      .slice(0, 15)
      .map(([sponsor, count]) => ({
        sponsor:
          sponsor.length > 30 ? sponsor.substring(0, 30) + '...' : sponsor,
        count,
      }));
  }, [data]);

  return (
    <StudyChartContainer title="Clinical Trials by Sponsor">
      <ChartContainer config={chartConfig} className="h-[450px] w-full">
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
            width={200}
            tick={{ fontSize: 12 }}
          />
          <Bar dataKey="count" fill="#2563eb" radius={4} />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
