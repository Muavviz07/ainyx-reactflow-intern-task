import React from 'react';
import { useAppStore } from '@/store/appStore';
import { useApps } from '@/hooks/useApps';
import { Inspector } from '../Inspector/Inspector';
import { X, Layers, Compass, Loader2 } from 'lucide-react';

export const RightPanel: React.FC = () => {
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId);
  const isMobilePanelOpen = useAppStore((s) => s.isMobilePanelOpen);
  const toggleMobilePanel = useAppStore((s) => s.toggleMobilePanel);
  const shouldSimulateError = useAppStore((s) => s.shouldSimulateError);

  // TanStack query to fetch apps
  const { data: apps, isLoading, error } = useApps();

  const handleAppClick = (appId: string) => {
    if (shouldSimulateError) return;
    setSelectedAppId(appId);
  };

  const renderAppsList = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-6 text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-xs">Loading app registry...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-3.5 rounded-lg border border-destructive/20 bg-destructive/5 text-destructive text-xs">
          Failed to load app registry. Click "Simulate Error" to restore connection.
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1.5">
        {apps?.map((app) => {
          const isActive = app.id === selectedAppId;
          return (
            <button
              key={app.id}
              onClick={() => handleAppClick(app.id)}
              disabled={shouldSimulateError}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-left transition-all ${
                isActive
                  ? 'bg-primary/5 border-primary text-foreground shadow-sm'
                  : 'bg-card border-border hover:bg-accent/50 text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-primary animate-pulse' : 'bg-muted-foreground/45'}`} />
                <span className="text-xs font-semibold">{app.name}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent text-accent-foreground select-none uppercase">
                {app.icon}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  const panelContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* App Selector / App list section */}
      <div className="p-4 border-b border-border bg-accent/20">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-4 h-4 text-primary" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            App Register
          </h2>
        </div>
        {renderAppsList()}
      </div>

      {/* Node Inspector section */}
      <div className="flex-1 overflow-y-auto">
        <Inspector />
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Panel View */}
      <aside className="hidden md:flex w-[320px] h-full flex-col border-l border-border bg-card shrink-0 z-10 shadow-sm overflow-hidden">
        {panelContent}
      </aside>

      {/* 2. Mobile Drawer slide-over */}
      {isMobilePanelOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => toggleMobilePanel(false)}
          />

          {/* Drawer container */}
          <div className="relative ml-auto w-[300px] h-full bg-card border-l border-border shadow-2xl flex flex-col z-50 transition-all duration-300 transform translate-x-0">
            {/* Drawer close handle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-accent/20 shrink-0">
              <span className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-2">
                <Compass className="w-4 h-4 text-primary" /> Detail Inspector
              </span>
              <button
                onClick={() => toggleMobilePanel(false)}
                className="p-1 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-all"
                aria-label="Close panel"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Inner Content */}
            <div className="flex-1 overflow-y-auto">
              {panelContent}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
