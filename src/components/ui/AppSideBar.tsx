import { Home, ChartArea, LayoutDashboard, Plus } from 'lucide-react';
import { useState } from 'react';
import { useDashboardLayouts } from '@/hooks/use-dashboard-layouts';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Charts',
    url: '/charts',
    icon: ChartArea,
  },
];

export default function AppSidebar() {
  const { layouts, createLayout } = useDashboardLayouts();
  const [newLayoutName, setNewLayoutName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateLayout = () => {
    if (newLayoutName.trim()) {
      createLayout(newLayoutName.trim());
      setNewLayoutName('');
      setIsCreating(false);
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span className="text-black">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton>
                  <LayoutDashboard />
                  <span className="text-black">Dashboards</span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {layouts.map(layout => (
                    <SidebarMenuSubItem key={layout.id}>
                      <SidebarMenuSubButton asChild>
                        <a
                          href={
                            layout.isDefault
                              ? '/dashboard'
                              : `/dashboard/${layout.id}`
                          }
                        >
                          <span className="text-black">{layout.name}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}

                  <SidebarMenuSubItem>
                    {isCreating ? (
                      <div className="flex gap-1 p-1">
                        <input
                          type="text"
                          value={newLayoutName}
                          onChange={e => setNewLayoutName(e.target.value)}
                          placeholder="Layout name"
                          className="flex-1 text-xs px-2 py-1 border rounded"
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleCreateLayout();
                            if (e.key === 'Escape') setIsCreating(false);
                          }}
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCreateLayout}
                          className="h-6 w-6 p-0"
                        >
                          ✓
                        </Button>
                      </div>
                    ) : (
                      <SidebarMenuSubButton onClick={() => setIsCreating(true)}>
                        <Plus className="h-3 w-3" />
                        <span className="text-black text-xs">New Layout</span>
                      </SidebarMenuSubButton>
                    )}
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
