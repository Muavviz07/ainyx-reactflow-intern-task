import React from 'react';
import { Network, LayoutDashboard, Database, Activity, Settings, HelpCircle } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: false },
    { icon: Network, label: 'Topology Graph', active: true },
    { icon: Database, label: 'Data Sources', active: false },
    { icon: Activity, label: 'Metrics', active: false },
    { icon: Settings, label: 'Settings', active: false },
  ];

  return (
    <aside className="w-[60px] h-full flex flex-col items-center justify-between py-4 bg-card border-r border-border shrink-0 z-10 shadow-sm">
      {/* Top Section - Brand Icon */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner hover:scale-105 transition-all">
          <Network className="w-6 h-6 stroke-[2]" />
        </div>
        
        {/* Navigation items */}
        <nav className="flex flex-col items-center gap-3 w-full">
          {navItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                title={item.label}
                className={`relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200 group ${
                  item.active
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[1.75]" />
                
                {/* Custom tooltip mimicking standard shadcn tooltip */}
                <div className="absolute left-[64px] bg-popover text-popover-foreground border border-border text-xs px-2.5 py-1 rounded shadow-md opacity-0 scale-90 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap z-50">
                  {item.label}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section - Help Icon */}
      <div className="w-full flex justify-center">
        <button
          title="Help & Support"
          className="relative w-10 h-10 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-accent hover:text-foreground transition-all group"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.75]" />
          <div className="absolute left-[64px] bg-popover text-popover-foreground border border-border text-xs px-2.5 py-1 rounded shadow-md opacity-0 scale-90 translate-x-[-10px] pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-0 transition-all duration-150 whitespace-nowrap z-50">
            Help & Docs
          </div>
        </button>
      </div>
    </aside>
  );
};
