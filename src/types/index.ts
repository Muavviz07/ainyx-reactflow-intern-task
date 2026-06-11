import type { Node } from '@xyflow/react';

export type NodeStatus = 'Healthy' | 'Degraded' | 'Down';

export interface ServiceNodeData extends Record<string, unknown> {
  label: string;
  status: NodeStatus;
  value: number;
  description?: string;
  type?: 'service' | 'database';
  tags?: string[];
}

export type ServiceNode = Node<ServiceNodeData>;

export interface App {
  id: string;
  name: string;
  icon: 'go' | 'java' | 'python' | string;
}

export interface GraphResponse {
  nodes: {
    id: string;
    position: { x: number; y: number };
    data: {
      label: string;
      status: NodeStatus;
      value: number;
      description?: string;
      type?: 'service' | 'database';
      tags?: string[];
    };
    type?: string;
  }[];
  edges: {
    id: string;
    source: string;
    target: string;
  }[];
}
