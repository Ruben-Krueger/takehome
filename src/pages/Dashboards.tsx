import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useDashboardLayouts } from '@/hooks/use-dashboard-layouts';
import type { ChartType } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { FiltersPanel } from '@/components/FiltersPanel';
import TrialCount from '@/components/charts/TrialCountChart';
import ConditionsChart from '@/components/charts/ConditionsChart';
import RegionChart from '@/components/charts/RegionChart';
import StartDateChart from '@/components/charts/StartDateChart';
import SmartClassificationChart from '@/components/charts/SmartClassificationChart';
import SmartOverviewClassificationChart from '@/components/charts/SmartOverviewClassificationChart';
import SmartPhaseClassificationChart from '@/components/charts/SmartPhaseClassificationChart';
import SmartPopulationClassificationChart from '@/components/charts/SmartPopulationClassificationChart';
import SmartTherapeuticClassificationChart from '@/components/charts/SmartTherapeuticClassificationChart';
import SmartTreatmentClassificationChart from '@/components/charts/SmartTreatmentClassificationChart';

const CHART_COMPONENTS = {
  TrialCount,
  ConditionsChart,
  RegionChart,
  StartDateChart,
  SmartClassificationChart,
  SmartTherapeuticClassificationChart,
  SmartPhaseClassificationChart,
  SmartTreatmentClassificationChart,
  SmartPopulationClassificationChart,
  SmartOverviewClassificationChart,
};

const CHARTS: { type: ChartType; label: string }[] = [
  { type: 'TrialCount', label: 'Trial Count' },
  { type: 'ConditionsChart', label: 'Conditions Chart' },
  { type: 'RegionChart', label: 'Region Chart' },
  { type: 'StartDateChart', label: 'Start Date' },
  {
    type: 'SmartPhaseClassificationChart',
    label: 'Phases - Smart Classifications',
  },
  {
    type: 'SmartTherapeuticClassificationChart',
    label: 'Therapeutics - Smart Classifications',
  },
  {
    type: 'SmartTreatmentClassificationChart',
    label: 'Treatments - Smart Classifications',
  },
  {
    type: 'SmartPopulationClassificationChart',
    label: 'Population - Smart Classifications',
  },
  {
    type: 'SmartOverviewClassificationChart',
    label: 'Overview - Smart Classifications',
  },
];

export default function Dashboard() {
  const { id } = useParams<{ id: string }>();
  const {
    getCurrentLayout,
    addWidget,
    removeWidget,
    updateLayout,
    layouts,
    currentLayoutId,
    setCurrentLayoutId,
  } = useDashboardLayouts();

  const [showAddChart, setShowAddChart] = useState(false);
  const [draggedWidget, setDraggedWidget] = useState<string | null>(null);

  const layoutId = id || currentLayoutId;
  const layout = layouts.find(l => l.id === id) || getCurrentLayout();

  if (layoutId !== currentLayoutId) {
    setCurrentLayoutId(layoutId);
  }

  // Filter out charts that are already added to the dashboard
  const availableCharts = CHARTS.filter(
    chart => !layout.widgets.some(widget => widget.type === chart.type)
  );

  const handleAddChart = (chartType: ChartType) => {
    const newWidget = {
      id: `widget-${Date.now()}`,
      type: chartType,
      position: { x: 0, y: layout.widgets.length },
      size: { width: 1, height: 1 },
    };
    addWidget(layout.id, newWidget);
    setShowAddChart(false);
  };

  const handleRemoveChart = (widgetId: string) => {
    removeWidget(layout.id, widgetId);
  };

  const handleDragStart = (e: React.DragEvent, widgetId: string) => {
    setDraggedWidget(widgetId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetWidgetId: string) => {
    e.preventDefault();

    if (draggedWidget && draggedWidget !== targetWidgetId) {
      const draggedIndex = layout.widgets.findIndex(
        w => w.id === draggedWidget
      );
      const targetIndex = layout.widgets.findIndex(
        w => w.id === targetWidgetId
      );

      if (draggedIndex !== -1 && targetIndex !== -1) {
        const newWidgets = [...layout.widgets];

        // Simple reordering logic - swap positions
        [newWidgets[draggedIndex], newWidgets[targetIndex]] = [
          newWidgets[targetIndex],
          newWidgets[draggedIndex],
        ];
        // Update positions
        newWidgets.forEach((widget, index) => {
          widget.position.y = Math.floor(index / 2);
          widget.position.x = index % 2;
        });

        // Actually update the layout with the new widget order
        updateLayout(layout.id, { widgets: newWidgets });
      } else {
        console.debug('Could not find layout widgets');
      }
    }
    setDraggedWidget(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">{layout.name}</h1>
        </div>
        {!layout.isDefault && (
          <Button
            onClick={() => setShowAddChart(!showAddChart)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Chart
          </Button>
        )}
      </div>

      {showAddChart && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add Chart</CardTitle>
          </CardHeader>
          <CardContent>
            {availableCharts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableCharts.map(chart => (
                  <Button
                    key={chart.type}
                    variant="outline"
                    onClick={() => handleAddChart(chart.type)}
                    className="justify-start"
                  >
                    {chart.label}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">
                All available charts have already been added to this dashboard.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <FiltersPanel />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {layout.widgets.map(widget => {
          const ChartComponent = CHART_COMPONENTS[widget.type];
          return (
            <div
              key={widget.id}
              className={`relative group h-full ${layout.isDefault ? 'cursor-default' : 'cursor-move'}`}
              draggable={!layout.isDefault}
              onDragStart={e => handleDragStart(e, widget.id)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, widget.id)}
            >
              {!layout.isDefault && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  onClick={() => handleRemoveChart(widget.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <div className="h-full">
                <ChartComponent />
              </div>
            </div>
          );
        })}
      </div>

      {layout.widgets.length === 0 && !layout.isDefault && (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No charts added yet</p>
        </div>
      )}
    </div>
  );
}
