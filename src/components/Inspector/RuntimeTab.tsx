import React from 'react';
import { useAppStore } from '@/store/appStore';
import type { ServiceNode } from '@/types';
import { 
  Activity, 
  Cpu, 
  TrendingUp, 
  Clock, 
  HardDrive 
} from 'lucide-react';

interface RuntimeTabProps {
  node: ServiceNode;
}

export const RuntimeTab: React.FC<RuntimeTabProps> = ({ node }) => {
  const updateNodeData = useAppStore((s) => s.updateNodeData);

  const value = node.data.value ?? 50;

  // Handles syncing load updates with safety bounds (0 - 100)
  const handleValueChange = (val: number) => {
    // Treat empty or NaN values as 0 for inputs
    const num = isNaN(val) ? 0 : val;
    const clamped = Math.max(0, Math.min(100, num));
    updateNodeData(node.id, { value: clamped });
  };

  return (
    <div className="flex flex-col gap-5">
      {/* 1. CPU Load Synced Slider + Numeric Input Section */}
      <div className="flex flex-col gap-2.5 p-3 rounded-xl border border-border bg-accent/15">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-primary" /> CPU Load Usage
          </label>
          <span className="text-[9px] text-muted-foreground font-mono">0 - 100%</span>
        </div>

        <div className="flex items-center gap-3">
          {/* Slider input */}
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            onChange={(e) => handleValueChange(Number(e.target.value))}
            className="flex-1 h-1.5 cursor-pointer accent-primary bg-border rounded-lg appearance-none"
            title="CPU Usage Slider"
          />

          {/* Synced Numeric input */}
          <div className="relative w-16 shrink-0">
            <input
              type="number"
              min="0"
              max="100"
              value={value}
              onChange={(e) => handleValueChange(Number(e.target.value))}
              className="h-8 w-full pl-2 pr-5 rounded-lg border border-border bg-card text-xs text-foreground font-mono font-bold focus:outline-none focus:border-primary text-center appearance-none"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-muted-foreground select-none">
              %
            </span>
          </div>
        </div>

        {/* Warning threshold messages */}
        {value >= 90 ? (
          <div className="text-[9.5px] text-red-500 font-semibold leading-none flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
            Critical Load: Node resource exhaustion imminent.
          </div>
        ) : value >= 70 ? (
          <div className="text-[9.5px] text-amber-500 font-semibold leading-none flex items-center gap-1 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
            High Load: Alert thresholds breached.
          </div>
        ) : (
          <div className="text-[9.5px] text-green-500 font-semibold leading-none flex items-center gap-1 mt-1">
            Normal operational resource profile.
          </div>
        )}
      </div>

      {/* 2. Secondary Mock Telemetry Statistics */}
      <div className="flex flex-col gap-3.5 pt-1">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-muted-foreground" /> Operational Metrics
        </span>

        {/* Metrics Rows */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Response Latency */}
          <div className="p-3 border border-border/80 bg-card rounded-lg flex flex-col gap-1">
            <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3 text-muted-foreground/65" /> Latency
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {value > 90 ? '452 ms' : value > 70 ? '194 ms' : '23 ms'}
            </span>
          </div>

          {/* Network Throughput */}
          <div className="p-3 border border-border/80 bg-card rounded-lg flex flex-col gap-1">
            <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-muted-foreground/65" /> Throughput
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {value > 90 ? '8.4 MB/s' : value > 70 ? '15.2 MB/s' : '48.9 MB/s'}
            </span>
          </div>

          {/* Memory Consumption */}
          <div className="p-3 border border-border/80 bg-card rounded-lg flex flex-col gap-1">
            <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
              <Cpu className="w-3 h-3 text-muted-foreground/65" /> Memory
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {value > 90 ? '94.2%' : value > 70 ? '78.5%' : '34.1%'}
            </span>
          </div>

          {/* Disk Space usage */}
          <div className="p-3 border border-border/80 bg-card rounded-lg flex flex-col gap-1">
            <span className="text-[9px] font-bold text-muted-foreground flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-muted-foreground/65" /> Disk space
            </span>
            <span className="font-mono text-xs font-bold text-foreground">
              {value > 90 ? '89.1%' : value > 70 ? '62.0%' : '14.8%'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
