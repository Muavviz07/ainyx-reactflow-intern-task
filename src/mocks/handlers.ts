import type { App, GraphResponse } from '@/types';
import { useAppStore } from '@/store/appStore';

const mockApps: App[] = [
  { id: 'app-1', name: 'Golang Service', icon: 'go' },
  { id: 'app-2', name: 'Java Service', icon: 'java' },
  { id: 'app-3', name: 'Python Service', icon: 'python' }
];

const mockGraphs: Record<string, GraphResponse> = {
  'app-1': {
    nodes: [
      { id: 'node-1', type: 'customNode', data: { label: 'Redis Cache', status: 'Healthy', value: 45, type: 'database', description: 'Primary Redis cache cluster used for session storage and temporary caching.', tags: ['CPU', 'Memory', 'US-East'] }, position: { x: 100, y: 150 } },
      { id: 'node-2', type: 'customNode', data: { label: 'Postgres DB', status: 'Degraded', value: 78, type: 'database', description: 'Core relational database containing customer accounts and transactions.', tags: ['Disk', 'Region', 'EU-Central'] }, position: { x: 350, y: 100 } },
      { id: 'node-3', type: 'customNode', data: { label: 'Mongodb Auth', status: 'Down', value: 92, type: 'database', description: 'Document store storing app user configurations and metadata.', tags: ['CPU', 'Disk', 'US-West'] }, position: { x: 250, y: 300 } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e2-3', source: 'node-2', target: 'node-3' }
    ]
  },
  'app-2': {
    nodes: [
      { id: 'node-1', type: 'customNode', data: { label: 'Kafka Broker', status: 'Healthy', value: 32, type: 'service', description: 'Message broker cluster processing analytical and application events.', tags: ['Memory', 'Region', 'US-East'] }, position: { x: 100, y: 100 } },
      { id: 'node-2', type: 'customNode', data: { label: 'MySQL Accounts', status: 'Healthy', value: 54, type: 'database', description: 'Transactional database storing member profiles.', tags: ['Disk', 'US-East'] }, position: { x: 350, y: 50 } },
      { id: 'node-3', type: 'customNode', data: { label: 'Elasticsearch', status: 'Degraded', value: 81, type: 'service', description: 'Search cluster indexing public items and catalogs.', tags: ['Memory', 'Disk'] }, position: { x: 350, y: 250 } },
      { id: 'node-4', type: 'customNode', data: { label: 'Cassandra Log', status: 'Down', value: 98, type: 'database', description: 'Time-series database holding raw audit trails.', tags: ['CPU', 'Region', 'AP-South'] }, position: { x: 580, y: 150 } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e1-3', source: 'node-1', target: 'node-3' },
      { id: 'e3-4', source: 'node-3', target: 'node-4' }
    ]
  },
  'app-3': {
    nodes: [
      { id: 'node-1', type: 'customNode', data: { label: 'RabbitMQ Queue', status: 'Healthy', value: 18, type: 'service', description: 'Task queue managing async workers.', tags: ['Memory', 'Region'] }, position: { x: 150, y: 100 } },
      { id: 'node-2', type: 'customNode', data: { label: 'SQLite Memory', status: 'Healthy', value: 24, type: 'database', description: 'In-memory configuration storage.', tags: ['CPU', 'Memory'] }, position: { x: 400, y: 50 } },
      { id: 'node-3', type: 'customNode', data: { label: 'DynamoDB Stats', status: 'Healthy', value: 42, type: 'database', description: 'AWS DynamoDB table for telemetry metrics.', tags: ['Disk', 'US-East'] }, position: { x: 400, y: 250 } }
    ],
    edges: [
      { id: 'e1-2', source: 'node-1', target: 'node-2' },
      { id: 'e1-3', source: 'node-1', target: 'node-3' }
    ]
  }
};

export const mockApi = {
  getApps: (): Promise<App[]> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const simulateError = useAppStore.getState().shouldSimulateError;
        if (simulateError) {
          reject(new Error('Network Error: Failed to fetch apps list.'));
        } else {
          resolve([...mockApps]);
        }
      }, 500);
    });
  },

  getGraph: (appId: string): Promise<GraphResponse> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const simulateError = useAppStore.getState().shouldSimulateError;
        if (simulateError) {
          reject(new Error(`Network Error: Failed to fetch graph configuration for app ID "${appId}".`));
        } else {
          const saved = localStorage.getItem(`graph-state:${appId}`);
          if (saved) {
            try {
              resolve(JSON.parse(saved));
              return;
            } catch (e) {
              console.error('Failed to parse saved graph state', e);
            }
          }
          const graph = mockGraphs[appId] || mockGraphs['app-1'];
          // Return a deep copy to ensure local modifications don't contaminate the initial mock store template
          resolve(JSON.parse(JSON.stringify(graph)));
        }
      }, 800);
    });
  }
};
