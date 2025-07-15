import { Pie, PieChart, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import StudyChartContainer from '../study-chart-container';
import useStudyData from '@/hooks/use-study-data';
import { useMemo } from 'react';

const COLORS = [
  '#2563eb',
  '#60a5fa',
  '#3b82f6',
  '#1d4ed8',
  '#1e40af',
  '#1e3a8a',
  '#312e81',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
];

export default function ConditionsChart() {
  const { data } = useStudyData();

  const { chartData, chartConfig } = useMemo(() => {
    if (!data) return { chartData: [], chartConfig: {} };

    const conditionCounts = data.reduce(
      (acc, study) => {
        study.conditions.forEach(condition => {
          acc[condition] = (acc[condition] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>
    );

    const sortedConditions = Object.entries(conditionCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10);

    const pieData = sortedConditions.map(([condition, count], index) => ({
      condition,
      count,
      fill: COLORS[index % COLORS.length],
    }));

    const config = sortedConditions.reduce((acc, [condition], index) => {
      acc[condition] = {
        label: condition,
        color: COLORS[index % COLORS.length],
      };
      return acc;
    }, {} as ChartConfig);

    return { chartData: pieData, chartConfig: config };
  }, [data]);

  return (
    <StudyChartContainer title="Clinical Trials by Conditions">
      <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="condition"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend content={<ChartLegendContent />} />
        </PieChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
