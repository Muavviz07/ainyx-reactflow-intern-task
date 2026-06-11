import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { useAppStore } from '@/store/appStore';
import { useApps } from '@/hooks/useApps';
import { 
  Maximize, 
  AlertTriangle, 
  Menu, 
  Share2, 
  Sun, 
  Moon, 
  User, 
  Cpu
} from 'lucide-react';

export const TopBar: React.FC = () => {
  const { fitView } = useReactFlow();
  
  // Zustand store bindings
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const setSelectedAppId = useAppStore((s) => s.setSelectedAppId);
  const toggleMobilePanel = useAppStore((s) => s.toggleMobilePanel);
  const shouldSimulateError = useAppStore((s) => s.shouldSimulateError);
  const toggleErrorSimulation = useAppStore((s) => s.toggleErrorSimulation);

  // Fetch apps for the dropdown selector
  const { data: apps, isLoading } = useApps();

  // Local state for theme (light/dark)
  const [theme, setTheme] = React.useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    const root = window.document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const handleFitView = () => {
    // Gracefully trigger fit view with smooth animation
    fitView({ padding: 0.15, duration: 600 });
  };

  return (
    <header className="h-16 w-full flex items-center justify-between px-6 bg-card border-b border-border z-20 shrink-0 shadow-sm">
      {/* Brand logo + Title + Mobile menu button */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={() => toggleMobilePanel()}
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all mr-1"
          aria-label="Toggle Inspector Panel"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
          <Cpu className="w-4.5 h-4.5 stroke-[2.2]" />
        </div>
        <div>
          <h1 className="font-semibold text-sm tracking-tight text-foreground md:text-base leading-none">
            Ainyx
          </h1>
          <span className="text-[10px] font-medium text-muted-foreground leading-none">
            Service Node Inspector
          </span>
        </div>
      </div>

      {/* App dropdown selector + Fit View */}
      <div className="flex items-center gap-2.5">
        {/* App selector */}
        <div className="flex items-center gap-1.5 bg-accent/40 rounded-lg border border-border px-2.5 py-1">
          <span className="text-xs text-muted-foreground font-medium hidden sm:inline">
            Active App:
          </span>
          <select
            value={selectedAppId || ''}
            onChange={(e) => setSelectedAppId(e.target.value)}
            disabled={isLoading || shouldSimulateError}
            className="bg-transparent border-0 outline-none text-xs text-foreground font-medium pr-6 py-0.5 cursor-pointer disabled:opacity-50"
          >
            {apps?.map((app) => (
              <option key={app.id} value={app.id} className="bg-popover text-foreground">
                {app.name} ({app.icon.toUpperCase()})
              </option>
            ))}
          </select>
        </div>

        {/* Fit View button */}
        <button
          onClick={handleFitView}
          className="h-8 flex items-center gap-1.5 px-3 rounded-lg border border-border bg-card text-xs text-foreground hover:bg-accent hover:text-accent-foreground font-medium shadow-sm transition-all hover:border-accent"
          title="Zoom graph to fit canvas"
        >
          <Maximize className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Fit View</span>
        </button>
      </div>

      {/* Action shortcuts: Error Injector, Theme toggle, Share, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* Simulated error trigger */}
        <button
          onClick={toggleErrorSimulation}
          className={`h-8 flex items-center gap-1.5 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
            shouldSimulateError
              ? 'bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20 animate-pulse'
              : 'bg-card text-muted-foreground border-border hover:bg-accent hover:text-foreground'
          }`}
          title="Toggle network error simulation"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {shouldSimulateError ? 'Simulating Error' : 'Simulate Error'}
          </span>
        </button>

        {/* Share Button (placeholder) */}
        <button
          onClick={() => alert('Sharing capability simulated!')}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          title="Share workspace topology"
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Theme Toggle (placeholder but operational) */}
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-border" />

        {/* User Profile Avatar */}
        <div className="w-8 h-8 rounded-full border border-border bg-accent/60 flex items-center justify-center text-foreground font-semibold text-xs shadow-inner cursor-pointer hover:scale-105 transition-all">
          <User className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};
