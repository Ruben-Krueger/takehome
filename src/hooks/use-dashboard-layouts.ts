import { useState, useEffect } from 'react';
import type { DashboardLayout, ChartWidget } from '@/types/dashboard';

const DEFAULT_LAYOUT: DashboardLayout = {
  id: 'default',
  name: 'Default Layout',
  isDefault: true,
  widgets: [
    {
      id: 'trial-count',
      type: 'TrialCount',
      position: { x: 0, y: 0 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'conditions-chart',
      type: 'ConditionsChart',
      position: { x: 1, y: 0 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'sponsors-chart',
      type: 'SponsorsChart',
      position: { x: 0, y: 1 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'top-sponsors-chart',
      type: 'TopSponsorsChart',
      position: { x: 1, y: 1 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'region-chart',
      type: 'RegionChart',
      position: { x: 0, y: 2 },
      size: { width: 1, height: 1 },
    },
    {
      id: 'all-studies-table',
      type: 'AllStudiesTable',
      position: { x: 0, y: 3 },
      size: { width: 2, height: 1 },
    },
  ],
  createdAt: new Date(),
  updatedAt: new Date(),
};

export function useDashboardLayouts() {
  const [layouts, setLayouts] = useState<DashboardLayout[]>([DEFAULT_LAYOUT]);
  const [currentLayoutId, setCurrentLayoutId] = useState<string>('default');

  useEffect(() => {
    // persist charts
    const saved = localStorage.getItem('dashboard-layouts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLayouts([
            DEFAULT_LAYOUT,
            ...parsed.filter((l: DashboardLayout) => !l.isDefault),
          ]);
        }
      } catch (error) {
        console.error('Failed to parse saved layouts:', error);
      }
    }
  }, []);

  const saveLayouts = (newLayouts: DashboardLayout[]) => {
    const nonDefaultLayouts = newLayouts.filter(l => !l.isDefault);
    localStorage.setItem(
      'dashboard-layouts',
      JSON.stringify(nonDefaultLayouts)
    );
    setLayouts(newLayouts);
  };

  const createLayout = (name: string): DashboardLayout => {
    const newLayout: DashboardLayout = {
      id: `layout-${Date.now()}`,
      name,
      isDefault: false,
      widgets: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newLayouts = [...layouts, newLayout];
    saveLayouts(newLayouts);
    return newLayout;
  };

  const updateLayout = (
    layoutId: string,
    updates: Partial<DashboardLayout>
  ) => {
    const newLayouts = layouts.map(layout =>
      layout.id === layoutId
        ? { ...layout, ...updates, updatedAt: new Date() }
        : layout
    );
    saveLayouts(newLayouts);
  };

  const deleteLayout = (layoutId: string) => {
    if (layoutId === 'default') return;
    const newLayouts = layouts.filter(layout => layout.id !== layoutId);
    saveLayouts(newLayouts);
    if (currentLayoutId === layoutId) {
      setCurrentLayoutId('default');
    }
  };

  const addWidget = (layoutId: string, widget: ChartWidget) => {
    updateLayout(layoutId, {
      widgets: [
        ...(layouts.find(l => l.id === layoutId)?.widgets || []),
        widget,
      ],
    });
  };

  const removeWidget = (layoutId: string, widgetId: string) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (!layout) return;

    updateLayout(layoutId, {
      widgets: layout.widgets.filter(w => w.id !== widgetId),
    });
  };

  const updateWidget = (
    layoutId: string,
    widgetId: string,
    updates: Partial<ChartWidget>
  ) => {
    const layout = layouts.find(l => l.id === layoutId);
    if (!layout) return;

    updateLayout(layoutId, {
      widgets: layout.widgets.map(w =>
        w.id === widgetId ? { ...w, ...updates } : w
      ),
    });
  };

  const getCurrentLayout = () =>
    layouts.find(l => l.id === currentLayoutId) || DEFAULT_LAYOUT;

  return {
    layouts,
    currentLayoutId,
    setCurrentLayoutId,
    createLayout,
    updateLayout,
    deleteLayout,
    addWidget,
    removeWidget,
    updateWidget,
    getCurrentLayout,
  };
}
