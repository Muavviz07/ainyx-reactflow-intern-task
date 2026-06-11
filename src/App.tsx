import React, { useEffect } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { TopBar } from '@/components/Layout/TopBar';
import { Sidebar } from '@/components/Layout/Sidebar';
import { RightPanel } from '@/components/Layout/RightPanel';
import { Graph } from '@/components/Canvas/Graph';

// Create a single stable instance of QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevent distracting refetches
      retry: false,                // Keep error simulations fast
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App: React.FC = () => {
  // Initialize modern dark mode by default
  useEffect(() => {
    window.document.documentElement.classList.add('dark');
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactFlowProvider>
        <div className="h-screen w-screen flex flex-col overflow-hidden bg-background text-foreground transition-colors duration-200">
          {/* Top Bar Navigation */}
          <TopBar />

          {/* Sub Layout Wrapper */}
          <div className="flex flex-1 w-full overflow-hidden">
            {/* Left Hand Navigation Sidebar */}
            <Sidebar />

            {/* Middle Main Canvas Viewport */}
            <Graph />

            {/* Right Hand App and Inspector Drawer */}
            <RightPanel />
          </div>
        </div>
      </ReactFlowProvider>
    </QueryClientProvider>
  );
};

export default App;
