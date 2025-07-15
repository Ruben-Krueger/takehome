import { Home, ChartArea, LayoutDashboard, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';

export default function AppSidebar() {
  const location = useLocation();
  const { layouts, createLayout, deleteLayout } = useDashboardLayouts();
  const [newLayoutName, setNewLayoutName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [layoutToDelete, setLayoutToDelete] = useState<string | null>(null);

  const isOnDashboard = location.pathname.startsWith('/dashboard');

  const handleCreateLayout = () => {
    if (newLayoutName.trim()) {
      createLayout(newLayoutName.trim());
      setNewLayoutName('');
      setIsCreating(false);
    }
  };

  const handleDeleteLayout = (layoutId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLayoutToDelete(layoutId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (layoutToDelete) {
      deleteLayout(layoutToDelete);
      setDeleteDialogOpen(false);
      setLayoutToDelete(null);
    }
  };

  return (
    <>
      <Sidebar>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href={'/'}>
                      <Home />
                      <span className="text-black">Home</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href={'/charts'}>
                      <ChartArea />
                      <span className="text-black">Charts</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href={'/dashboard'}>
                      <LayoutDashboard />
                      <span className="text-black">Dashboards</span>
                    </a>
                  </SidebarMenuButton>
                  {isOnDashboard && (
                    <SidebarMenuSub>
                      {layouts.map(layout => (
                        <SidebarMenuSubItem key={layout.id}>
                          <div className="flex items-center justify-between w-full">
                            <SidebarMenuSubButton asChild className="flex-1">
                              <a
                                href={
                                  layout.isDefault
                                    ? '/dashboard'
                                    : `/dashboard/${layout.id}`
                                }
                              >
                                <span className="text-black">
                                  {layout.name}
                                </span>
                              </a>
                            </SidebarMenuSubButton>
                            {!layout.isDefault && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                onClick={e => handleDeleteLayout(layout.id, e)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
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
                          <SidebarMenuSubButton
                            onClick={() => setIsCreating(true)}
                          >
                            <Plus className="h-3 w-3" />
                            <span className="text-black text-xs">
                              New Layout
                            </span>
                          </SidebarMenuSubButton>
                        )}
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Layout</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this layout? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
