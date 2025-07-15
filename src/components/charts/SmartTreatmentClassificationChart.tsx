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

function TreatmentTypesChart({ stats }: { stats: ClassificationStats }) {
  const data = Object.entries(stats.treatmentTypes)
    .map(([type, count]) => ({ name: type, value: count }))
    .sort((a, b) => (b.value as number) - (a.value as number));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function SmartTreatmentClassificationChart() {
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
        <CardTitle>Treatment Types Distribution</CardTitle>
        <div>
          <p className="text-sm text-muted-foreground">
            AI-powered treatment type classification based on title analysis
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <TreatmentTypesChart stats={stats} />
      </CardContent>
    </Card>
  );
}
