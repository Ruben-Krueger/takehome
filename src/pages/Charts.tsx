import useStudyData from '@/hooks/use-study-data';
import type { JSX } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import TrialCount from '@/components/charts/TrialCountChart';
import ConditionsChart from '@/components/charts/ConditionsChart';
import RegionChart from '@/components/charts/RegionChart';
import StartDateChart from '@/components/charts/StartDateChart';
import SmartTherapeuticClassificationChart from '@/components/charts/SmartTherapeuticClassificationChart';
import SmartPhaseClassificationChart from '@/components/charts/SmartPhaseClassificationChart';
import SmartTreatmentClassificationChart from '@/components/charts/SmartTreatmentClassificationChart';
import SmartPopulationClassificationChart from '@/components/charts/SmartPopulationClassificationChart';
import SmartOverviewClassificationChart from '@/components/charts/SmartOverviewClassificationChart';

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl bg-muted/30" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px] bg-muted/30" />
        <Skeleton className="h-4 w-[200px] bg-muted/30" />
      </div>
    </div>
  );
}

export default function Charts(): JSX.Element {
  const { data, error, loading } = useStudyData();
  return (
    <div className="flex flex-col p-6">
      <div className="flex justify-start mb-6">
        <h1 className="text-2xl font-bold">Charts</h1>
      </div>

      <div className="justify-center items-center flex-col">
        {loading ? (
          <SkeletonCard />
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>An error occured</AlertTitle>
            <AlertDescription>{JSON.stringify(error)}</AlertDescription>
          </Alert>
        ) : data ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ">
            <TrialCount />
            <ConditionsChart />
            <RegionChart />
            <StartDateChart />
            <SmartTherapeuticClassificationChart />
            <SmartPhaseClassificationChart />
            <SmartTreatmentClassificationChart />
            <SmartPopulationClassificationChart />
            <SmartOverviewClassificationChart />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
