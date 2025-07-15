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
import SponsorsChart from '@/components/charts/SponsorsChart';
import TopSponsorsChart from '@/components/charts/TopSponsorsChart';
import RegionChart from '@/components/charts/RegionChart';
import { AllStudiesTable } from '@/components/charts/AllStudiesTable';

const CHART_COMPONENTS = {
  TrialCount,
  ConditionsChart,
  SponsorsChart,
  TopSponsorsChart,
  RegionChart,
  AllStudiesTable,
};

const AVAILABLE_CHARTS: { type: ChartType; label: string }[] = [
  { type: 'TrialCount', label: 'Trial Count' },
  { type: 'ConditionsChart', label: 'Conditions Chart' },
  { type: 'SponsorsChart', label: 'Sponsors Chart' },
  { type: 'TopSponsorsChart', label: 'Top Sponsors Chart' },
  { type: 'RegionChart', label: 'Region Chart' },
  { type: 'AllStudiesTable', label: 'All Studies Table' },
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
  const layout = layouts.find(l => l.id === layoutId) || getCurrentLayout();

  if (layoutId !== currentLayoutId) {
    setCurrentLayoutId(layoutId);
  }

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

      console.log('x0', targetIndex, draggedIndex);

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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {AVAILABLE_CHARTS.map(chart => (
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
              className={`relative group ${
                widget.type === 'AllStudiesTable' ? 'col-span-full' : ''
              }`}
              draggable={!layout.isDefault}
              onDragStart={e => handleDragStart(e, widget.id)}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, widget.id)}
            >
              <Card
                className={`h-full overflow-hidden ${layout.isDefault ? 'cursor-default' : 'cursor-move'}`}
              >
                <CardContent className="p-4 overflow-hidden">
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
                  <ChartComponent />
                </CardContent>
              </Card>
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
