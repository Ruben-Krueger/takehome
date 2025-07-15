import { useMemo } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  classifyStudies,
  getClassificationStats,
  type ClassificationStats,
} from '@/lib/studyClassifier';
import useStudyData from '@/hooks/use-study-data';

const COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7300',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#ffff00',
  '#ff00ff',
  '#00ffff',
  '#800080',
  '#008000',
  '#000080',
  '#808000',
  '#800080',
];

function StudyPhasesChart({ stats }: { stats: ClassificationStats }) {
  const data = Object.entries(stats.studyPhases)
    .map(([phase, count]) => ({ name: phase, value: count }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function SmartPhaseClassificationChart() {
  const { data } = useStudyData();

  const stats = useMemo(() => {
    if (!data)
      return {
        therapeuticAreas: {},
        studyPhases: {},
        treatmentTypes: {},
        populations: {},
        totalStudies: 0,
        averageConfidence: 0,
      };

    const results = classifyStudies(data);
    const stats = getClassificationStats(results);
    return stats;
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Study Phases Distribution</CardTitle>
        <div>
          <p className="text-sm text-muted-foreground">
            AI-powered study phase classification based on title analysis
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <StudyPhasesChart stats={stats} />
      </CardContent>
    </Card>
  );
}
