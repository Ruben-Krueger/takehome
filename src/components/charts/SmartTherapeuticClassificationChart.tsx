import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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

function TherapeuticAreasChart({ stats }: { stats: ClassificationStats }) {
  const data = Object.entries(stats.therapeuticAreas)
    .map(([area, count]) => ({ name: area, value: count }))
    .sort((a, b) => (b.value as number) - (a.value as number))
    .slice(0, 10);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function SmartTherapeuticClassificationChart() {
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
        <CardTitle>Therapeutic Areas Distribution</CardTitle>
        <div>
          <p className="text-sm text-muted-foreground">
            AI-powered therapeutic area classification based on title analysis
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <TherapeuticAreasChart stats={stats} />
      </CardContent>
    </Card>
  );
}
