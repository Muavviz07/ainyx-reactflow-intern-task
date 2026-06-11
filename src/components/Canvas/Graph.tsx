import React, { useEffect, useState, useCallback } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  BackgroundVariant,
  useReactFlow,
  Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useAppStore } from '@/store/appStore';
import { useGraph } from '@/hooks/useGraph';
import { CustomNode } from './CustomNode';
import { 
  AlertTriangle, 
  Loader2, 
  Plus, 
  X
} from 'lucide-react';
import type { ServiceNode, NodeStatus } from '@/types';

const nodeTypes = {
  customNode: CustomNode,
};

export const Graph: React.FC = () => {
  const { fitView } = useReactFlow();

  // Zustand state and actions
  const selectedAppId = useAppStore((s) => s.selectedAppId);
  const loadedAppId = useAppStore((s) => s.loadedAppId);
  const setLoadedAppId = useAppStore((s) => s.setLoadedAppId);
  const setSelectedNodeId = useAppStore((s) => s.setSelectedNodeId);
  const nodes = useAppStore((s) => s.nodes);
  const edges = useAppStore((s) => s.edges);
  const setNodes = useAppStore((s) => s.setNodes);
  const setEdges = useAppStore((s) => s.setEdges);
  const onNodesChange = useAppStore((s) => s.onNodesChange);
  const onEdgesChange = useAppStore((s) => s.onEdgesChange);
  const deleteNode = useAppStore((s) => s.deleteNode);
  const toggleMobilePanel = useAppStore((s) => s.toggleMobilePanel);
  const addNode = useAppStore((s) => s.addNode);

  // Add Node local states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newNodeName, setNewNodeName] = useState('New Service');
  const [newNodeStatus, setNewNodeStatus] = useState<NodeStatus>('Healthy');
  const [newNodeType, setNewNodeType] = useState<'service' | 'database'>('service');
  const [newNodeCpu, setNewNodeCpu] = useState(50);

  // TanStack Query to fetch graph state
  const { data: graphData, isLoading, error, refetch } = useGraph(selectedAppId);

  // 1. Sync React Query data to Zustand store
  useEffect(() => {
    if (graphData && selectedAppId && loadedAppId !== selectedAppId) {
      setNodes(graphData.nodes as ServiceNode[]);
      setEdges(graphData.edges);
      setLoadedAppId(selectedAppId);
      
      // Auto-fit view after state changes propagate
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 });
      }, 50);
    }
  }, [graphData, selectedAppId, loadedAppId, setNodes, setEdges, setLoadedAppId, fitView]);

  // 2. Keyboard shortcuts hook: Ctrl+F = Fit View, Ctrl+L = Toggle Mobile Drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        fitView({ padding: 0.15, duration: 600 });
      }
      if (e.ctrlKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleMobilePanel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fitView, toggleMobilePanel]);

  // 3. LocalStorage persistence hook
  useEffect(() => {
    if (selectedAppId && loadedAppId === selectedAppId && nodes.length > 0) {
      localStorage.setItem(
        `graph-state:${selectedAppId}`,
        JSON.stringify({ nodes, edges })
      );
    }
  }, [nodes, edges, selectedAppId, loadedAppId]);

  // Handle deletion of nodes selected via keyboard Delete/Backspace
  const handleNodesDelete = useCallback(
    (deleted: ServiceNode[]) => {
      deleted.forEach((node) => {
        deleteNode(node.id);
      });
    },
    [deleteNode]
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNodeName.trim()) return;

    const id = `node-${Date.now()}`;
    const node: ServiceNode = {
      id,
      type: 'customNode',
      position: {
        x: Math.random() * 200 + 150,
        y: Math.random() * 200 + 100,
      },
      data: {
        label: newNodeName.trim(),
        status: newNodeStatus,
        type: newNodeType,
        value: newNodeCpu,
        description: `User-created ${newNodeType} database service.`,
        tags: [newNodeType === 'database' ? 'Disk' : 'Memory', 'Region', 'US-East'],
      },
    };

    addNode(node);
    setIsAddOpen(false);
    
    // Select the newly created node
    setSelectedNodeId(id);

    // Reset inputs
    setNewNodeName('New Service');
    setNewNodeStatus('Healthy');
    setNewNodeType('service');
    setNewNodeCpu(50);
  };

  // Loading Screen Layout
  if (isLoading) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-background relative">
        {/* Skeleton nodes background grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <div className="flex flex-col items-center gap-3.5 z-10 bg-card/65 backdrop-blur-md p-6 rounded-2xl border border-border shadow-lg">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <div className="text-center">
            <h4 className="font-semibold text-sm text-foreground">Loading service map</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">Assembling node configuration details...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error Screen Layout
  if (error) {
    return (
      <div className="flex-1 h-full flex flex-col items-center justify-center bg-background relative p-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        
        <div className="w-[380px] bg-card border border-destructive/25 text-center p-6 rounded-2xl shadow-xl z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-destructive/15 flex items-center justify-center text-destructive mb-3.5">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="font-semibold text-sm text-foreground mb-1">Topology Query Failed</h3>
          <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
            {error.message || "An unexpected error occurred while loading the dependency graph."}
          </p>
          <button
            onClick={() => refetch()}
            className="w-full h-9 bg-destructive hover:bg-destructive/90 text-destructive-foreground text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 h-full bg-background relative select-none">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={handleNodesDelete}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => setSelectedNodeId(node.id)}
        onPaneClick={() => setSelectedNodeId(null)}
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.25}
        maxZoom={2}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} className="text-muted-foreground/35" />
        <Controls showInteractive={false} className="!bg-card !border-border !shadow-md !rounded-lg overflow-hidden [&_button]:!bg-transparent [&_button]:!border-border [&_button]:!text-foreground [&_button:hover]:!bg-accent" />
        <MiniMap 
          nodeColor={(n) => {
            const status = (n.data as ServiceNodeData | undefined)?.status;
            if (status === 'Healthy') return '#22c55e';
            if (status === 'Degraded') return '#eab308';
            if (status === 'Down') return '#ef4444';
            return '#94a3b8';
          }}
          className="!bg-card !border-border !shadow-md !rounded-lg overflow-hidden hidden sm:block"
        />

        {/* Panel controls - Add Node */}
        <Panel position="bottom-right" className="flex gap-2">
          <button
            onClick={() => setIsAddOpen(true)}
            className="h-8 flex items-center gap-1.5 px-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-xs font-semibold shadow-md transition-all scale-100 hover:scale-105 active:scale-95"
            title="Create a new node dynamically"
          >
            <Plus className="w-4 h-4" />
            <span>Add Node</span>
          </button>
        </Panel>

        {/* Keyboard Shortcuts display helper panel */}
        <Panel position="bottom-left" className="bg-card/75 backdrop-blur-sm px-2.5 py-1.5 rounded-lg border border-border text-[10px] text-muted-foreground hidden sm:block">
          <div className="flex gap-3">
            <span><kbd className="px-1.5 py-0.5 border rounded bg-accent text-accent-foreground font-mono">Ctrl + F</kbd> Fit View</span>
            <span><kbd className="px-1.5 py-0.5 border rounded bg-accent text-accent-foreground font-mono">Ctrl + L</kbd> Toggle Panel</span>
          </div>
        </Panel>
      </ReactFlow>

      {/* Dynamic Add Node Dialog Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs">
          <div className="w-[360px] bg-card border border-border rounded-xl shadow-2xl p-5 relative">
            <button 
              onClick={() => setIsAddOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-all"
            >
              <X className="w-4.5 h-4.5" />
            </button>

            <h3 className="font-semibold text-sm text-foreground mb-4">Add Dependency Node</h3>

            <form onSubmit={handleAddSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Node Label</label>
                <input
                  type="text"
                  required
                  value={newNodeName}
                  onChange={(e) => setNewNodeName(e.target.value)}
                  placeholder="e.g. Postgres Replica"
                  className="h-9 px-3 rounded-lg border border-border bg-accent/35 text-xs text-foreground focus:outline-none focus:border-primary transition-all"
                />
              </div>

              {/* Grid selectors */}
              <div className="grid grid-cols-2 gap-3">
                {/* Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Type</label>
                  <select
                    value={newNodeType}
                    onChange={(e) => setNewNodeType(e.target.value as 'service' | 'database')}
                    className="h-9 px-2 rounded-lg border border-border bg-accent/35 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="service" className="bg-popover text-foreground">Service</option>
                    <option value="database" className="bg-popover text-foreground">Database</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Status</label>
                  <select
                    value={newNodeStatus}
                    onChange={(e) => setNewNodeStatus(e.target.value as NodeStatus)}
                    className="h-9 px-2 rounded-lg border border-border bg-accent/35 text-xs text-foreground focus:outline-none focus:border-primary"
                  >
                    <option value="Healthy" className="bg-popover text-green-500">Healthy</option>
                    <option value="Degraded" className="bg-popover text-amber-500">Degraded</option>
                    <option value="Down" className="bg-popover text-red-500">Down</option>
                  </select>
                </div>
              </div>

              {/* Slider for CPU load */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between text-[11px]">
                  <span className="font-bold uppercase tracking-wider text-muted-foreground">CPU load / Load</span>
                  <span className="font-mono font-semibold text-foreground">{newNodeCpu}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newNodeCpu}
                  onChange={(e) => setNewNodeCpu(Number(e.target.value))}
                  className="w-full cursor-pointer accent-primary"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-2.5 mt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 h-9 rounded-lg border border-border text-xs text-foreground hover:bg-accent transition-all font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold transition-all"
                >
                  Add Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
