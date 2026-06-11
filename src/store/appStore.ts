import { create } from 'zustand';
import type { ServiceNode, ServiceNodeData } from '@/types';
import type { Edge, NodeChange, EdgeChange } from '@xyflow/react';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

export interface AppStore {
  selectedAppId: string | null;
  loadedAppId: string | null;
  selectedNodeId: string | null;
  isMobilePanelOpen: boolean;
  activeInspectorTab: 'config' | 'runtime';
  nodes: ServiceNode[];
  edges: Edge[];
  shouldSimulateError: boolean;
  
  // Actions
  setSelectedAppId: (id: string | null) => void;
  setLoadedAppId: (id: string | null) => void;
  setSelectedNodeId: (id: string | null) => void;
  toggleMobilePanel: (open?: boolean) => void;
  setActiveInspectorTab: (tab: 'config' | 'runtime') => void;
  setNodes: (nodes: ServiceNode[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange<ServiceNode>[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  updateNodeData: (nodeId: string, data: Partial<ServiceNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  toggleErrorSimulation: () => void;
  addNode: (node: ServiceNode) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedAppId: 'app-1',
  loadedAppId: null,
  selectedNodeId: null,
  isMobilePanelOpen: false,
  activeInspectorTab: 'config',
  nodes: [],
  edges: [],
  shouldSimulateError: false,

  setSelectedAppId: (id) =>
    set((state) => {
      if (state.selectedAppId === id) return {};
      return {
        selectedAppId: id,
        loadedAppId: null,    // Reset loaded app ID to trigger reload
        selectedNodeId: null, // Reset selected node on app change
        nodes: [],            // Clear nodes before loading new app
        edges: [],
      };
    }),

  setLoadedAppId: (id) => set({ loadedAppId: id }),

  setSelectedNodeId: (id) =>
    set((state) => {
      // Toggle mobile drawer open when selecting a node on mobile
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      return {
        selectedNodeId: id,
        isMobilePanelOpen: id ? (isMobile ? true : state.isMobilePanelOpen) : false,
      };
    }),

  toggleMobilePanel: (open) =>
    set((state) => ({
      isMobilePanelOpen: open !== undefined ? open : !state.isMobilePanelOpen,
    })),

  setActiveInspectorTab: (tab) =>
    set({
      activeInspectorTab: tab,
    }),

  setNodes: (nodes) => set({ nodes }),
  
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set((state) => ({
      nodes: applyNodeChanges(changes, state.nodes) as ServiceNode[],
    })),

  onEdgesChange: (changes) =>
    set((state) => ({
      edges: applyEdgeChanges(changes, state.edges),
    })),

  updateNodeData: (nodeId, data) =>
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id === nodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              ...data,
            },
          };
        }
        return node;
      }),
    })),

  deleteNode: (nodeId) =>
    set((state) => {
      // Filter out deleted node
      const nextNodes = state.nodes.filter((node) => node.id !== nodeId);
      // Filter out connected edges
      const nextEdges = state.edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      );
      
      return {
        nodes: nextNodes,
        edges: nextEdges,
        // Reset selected node if it was the deleted one
        selectedNodeId: state.selectedNodeId === nodeId ? null : state.selectedNodeId,
      };
    }),

  toggleErrorSimulation: () =>
    set((state) => ({
      shouldSimulateError: !state.shouldSimulateError,
    })),

  addNode: (node) =>
    set((state) => ({
      nodes: [...state.nodes, node],
    })),
}));
