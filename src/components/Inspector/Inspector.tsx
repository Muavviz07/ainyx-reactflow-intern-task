import React from 'react';
import { useAppStore } from '@/store/appStore';
import { ConfigTab } from './ConfigTab';
import { RuntimeTab } from './RuntimeTab';
import { 
  Settings2, 
  Activity, 
  Trash2, 
  X, 
  Database,
  Cpu
} from 'lucide-react';

export const Inspector: React.FC = () => {
  const selectedNodeId = useAppStore((s) => s.selectedNodeId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const nodes = useAppStore((s) => s.nodes);
  const deleteNode = useAppStore((s) => s.deleteNode);
  
  const activeInspectorTab = useAppStore((s) => s.activeInspectorTab);
  const setActiveInspectorTab = useAppStore((s) => s.setActiveInspectorTab);

  // Find the selected node
  const node = nodes.find((n) => n.id === selectedNodeId);

  // Empty selection state
  if (!node) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center text-muted-foreground select-none">
        <div className="w-12 h-12 rounded-full bg-accent/40 flex items-center justify-center text-muted-foreground/60 mb-3.5">
          <Settings2 className="w-5.5 h-5.5 stroke-[1.5]" />
        </div>
        <h3 className="font-semibold text-xs text-foreground mb-1">No node selected</h3>
        <p className="text-[11px] leading-relaxed max-w-[200px]">
          Select a database or service node from the canvas topology to configure settings or inspect performance logs.
        </p>
      </div>
    );
  }

  const status = node.data.status;
  const isDatabase = node.data.type === 'database';

  const statusColors = {
    Healthy: 'bg-green-500/10 border-green-500/30 text-green-500 dark:text-green-400',
    Degraded: 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400',
    Down: 'bg-red-500/10 border-red-500/30 text-red-500 dark:text-red-400',
  }[status] || 'bg-muted border-border text-muted-foreground';

  return (
    <div className="h-full flex flex-col overflow-hidden bg-card select-none">
      {/* 1. Header Section */}
      <div className="p-4 border-b border-border flex flex-col gap-3 shrink-0">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg border ${isDatabase ? 'bg-purple-500/10 border-purple-500/20 text-purple-500' : 'bg-blue-500/10 border-blue-500/20 text-blue-500'}`}>
              {isDatabase ? <Database className="w-4 h-4" /> : <Cpu className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="font-bold text-xs text-foreground max-w-[150px] truncate leading-none">
                {node.data.label}
              </h2>
              <span className="text-[9px] text-muted-foreground font-mono">
                ID: {node.id}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Delete button */}
            <button
              onClick={() => deleteNode(node.id)}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-destructive/5 hover:border-destructive/20 transition-all"
              title="Delete node from topology"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            
            {/* Close details button */}
            <button
              onClick={() => setSelectedNodeId(null)}
              className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
              title="Deselect node"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status indicator badge */}
        <div className="flex items-center justify-between text-xs pt-1">
          <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Status</span>
          <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusColors}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${status === 'Healthy' ? 'bg-green-500' : status === 'Degraded' ? 'bg-amber-500' : 'bg-red-500'}`} />
            {status}
          </div>
        </div>
      </div>

      {/* 2. Tab Navigation */}
      <div className="flex border-b border-border shrink-0 p-1 bg-accent/20">
        <button
          onClick={() => setActiveInspectorTab('config')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            activeInspectorTab === 'config'
              ? 'bg-card text-foreground shadow-xs border border-border/40'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings2 className="w-3.5 h-3.5" />
          Config
        </button>
        <button
          onClick={() => setActiveInspectorTab('runtime')}
          className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-md transition-all ${
            activeInspectorTab === 'runtime'
              ? 'bg-card text-foreground shadow-xs border border-border/40'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Runtime
        </button>
      </div>

      {/* 3. Tab Content panels */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeInspectorTab === 'config' ? (
          <ConfigTab node={node} />
        ) : (
          <RuntimeTab node={node} />
        )}
      </div>
    </div>
  );
};
