import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import type { ServiceNodeData } from '@/types';
import { 
  Database, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Layers
} from 'lucide-react';

export const CustomNode: React.FC<NodeProps> = ({ data, selected }) => {
  const nodeData = data as ServiceNodeData;
  const status = nodeData.status;
  const isDatabase = nodeData.type === 'database';
  
  // Status style map
  const statusConfig = {
    Healthy: {
      color: 'bg-green-500',
      text: 'text-green-500 dark:text-green-400',
      border: 'border-green-500/30',
      bg: 'bg-green-500/10',
      icon: CheckCircle2,
      pulse: 'bg-green-500',
    },
    Degraded: {
      color: 'bg-amber-500',
      text: 'text-amber-500 dark:text-amber-400',
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/10',
      icon: AlertTriangle,
      pulse: 'bg-amber-500',
    },
    Down: {
      color: 'bg-red-500',
      text: 'text-red-500 dark:text-red-400',
      border: 'border-red-500/30',
      bg: 'bg-red-500/10',
      icon: XCircle,
      pulse: 'bg-red-500',
    },
  }[status] || {
    color: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
    bg: 'bg-muted/10',
    icon: Cpu,
    pulse: 'bg-muted',
  };


  return (
    <div
      className={`w-[240px] rounded-xl bg-card border text-card-foreground shadow-lg transition-all duration-300 relative ${
        selected
          ? 'border-primary ring-2 ring-primary/20 scale-[1.03] shadow-primary/10'
          : 'border-border hover:border-muted-foreground/35 hover:shadow-xl'
      }`}
    >
      {/* Target (Input) Handle */}
      <Handle
        type="target"
        position={Position.Left}
        className="w-3.5 h-3.5 !bg-card border-2 border-primary rounded-full hover:scale-125 transition-transform"
        style={{ left: -7 }}
      />

      {/* Top Status Accent Bar */}
      <div className={`h-1.5 w-full rounded-t-xl ${statusConfig.color}`} />

      {/* Main Node Content */}
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2">
            {/* Database vs Service Icon */}
            <div
              className={`p-1.5 rounded-lg border ${
                isDatabase 
                  ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' 
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-500'
              }`}
              title={isDatabase ? 'Database Node' : 'Application Service'}
            >
              {isDatabase ? (
                <Database className="w-4 h-4" />
              ) : (
                <Cpu className="w-4 h-4" />
              )}
            </div>
            
            {/* Node Title */}
            <div className="overflow-hidden">
              <h3 className="font-semibold text-xs leading-none text-foreground truncate max-w-[120px]">
                {nodeData.label}
              </h3>
              <span className="text-[9px] text-muted-foreground capitalize font-medium">
                {nodeData.type || 'Service'}
              </span>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border ${statusConfig.border} ${statusConfig.bg}`}>
            <span className="relative flex h-1.5 w-1.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${statusConfig.pulse}`} />
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${statusConfig.pulse}`} />
            </span>
            <span className={`text-[8.5px] font-bold tracking-wide uppercase ${statusConfig.text}`}>
              {status}
            </span>
          </div>
        </div>

        {/* CPU/Metric Usage Display */}
        <div className="mt-3 pt-3 border-t border-border/60">
          <div className="flex items-center justify-between text-[9px] text-muted-foreground mb-1.5 font-medium">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-muted-foreground/60" /> Load / CPU
            </span>
            <span className="font-semibold text-foreground font-mono">{nodeData.value}%</span>
          </div>
          
          {/* Health Slider Bar */}
          <div className="w-full h-1.5 bg-accent/60 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                nodeData.value > 90
                  ? 'bg-red-500'
                  : nodeData.value > 70
                  ? 'bg-amber-500'
                  : 'bg-green-500'
              }`}
              style={{ width: `${nodeData.value}%` }}
            />
          </div>
        </div>
      </div>

      {/* Source (Output) Handle */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-3.5 h-3.5 !bg-card border-2 border-primary rounded-full hover:scale-125 transition-transform"
        style={{ right: -7 }}
      />
    </div>
  );
};
