import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  classifyStudies,
  getClassificationStats,
  type ClassificationStats,
} from '@/lib/studyClassifier';
import useStudyData from '@/hooks/use-study-data';

function Overview({ stats }: { stats: ClassificationStats }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="text-xl font-bold">{stats.totalStudies}</div>
          <div className="text-sm text-muted-foreground">Total Studies</div>
        </div>
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="text-xl font-bold">
            {(stats.averageConfidence * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-muted-foreground">Avg Confidence</div>
        </div>
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="text-xl font-bold">
            {Object.keys(stats.therapeuticAreas).length}
          </div>
          <div className="text-sm text-muted-foreground">Therapeutic Areas</div>
        </div>
        <div className="p-4 border rounded-lg bg-muted/30">
          <div className="text-xl font-bold">
            {Object.keys(stats.studyPhases).length}
          </div>
          <div className="text-sm text-muted-foreground">Study Phases</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Top Therapeutic Areas</h4>
          <div className="space-y-2">
            {Object.entries(stats.therapeuticAreas)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .slice(0, 5)
              .map(([area, count]) => (
                <div
                  key={area}
                  className="flex justify-between items-center py-2"
                >
                  <span className="capitalize">{area}</span>
                  <Badge variant="secondary">{count as number}</Badge>
                </div>
              ))}
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-lg font-semibold">Study Phases Distribution</h4>
          <div className="space-y-2">
            {Object.entries(stats.studyPhases)
              .sort(([, a], [, b]) => (b as number) - (a as number))
              .map(([phase, count]) => (
                <div
                  key={phase}
                  className="flex justify-between items-center py-2"
                >
                  <span className="capitalize">{phase}</span>
                  <Badge variant="outline">{count as number}</Badge>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SmartOverviewClassificationChart() {
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
        <CardTitle>Smart Classification Overview</CardTitle>
        <div>
          <p className="text-sm text-muted-foreground">
            AI-powered study classification overview based on title analysis
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Overview stats={stats} />
      </CardContent>
    </Card>
  );
}
