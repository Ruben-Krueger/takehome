export interface ChartWidget {
  id: string;
  type:
    | 'TrialCount'
    | 'ConditionsChart'
    | 'SponsorsChart'
    | 'TopSponsorsChart'
    | 'RegionChart'
    | 'AllStudiesTable';
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
