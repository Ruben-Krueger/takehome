export interface ChartWidget {
  id: string;
  type:
    | 'TrialCount'
    | 'ConditionsChart'
    | 'RegionChart'
    | 'StartDateChart'
    | 'SmartPhaseClassificationChart'
    | 'SmartTherapeuticClassificationChart'
    | 'SmartTreatmentClassificationChart'
    | 'SmartPopulationClassificationChart'
    | 'SmartOverviewClassificationChart';

  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  isDefault: boolean;
  widgets: ChartWidget[];
  createdAt: Date;
  updatedAt: Date;
}

export type ChartType = ChartWidget['type'];
