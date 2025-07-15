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

const N_CONDITIONS = 5;

const COLORS = ['#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD'];

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
      .slice(0, N_CONDITIONS);

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
      <ChartContainer config={chartConfig} className="h-[400px] w-full">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="count"
            nameKey="condition"
            cx="50%"
            cy="40%"
            outerRadius={80}
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <ChartTooltip content={<ChartTooltipContent />} />
          <ChartLegend
            content={<ChartLegendContent />}
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
        </PieChart>
      </ChartContainer>
    </StudyChartContainer>
  );
}
