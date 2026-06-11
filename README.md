# Service Node Inspector UI

A production-grade React + ReactFlow application for inspecting and managing distributed service nodes.

**Tech Stack:** React 18 | Vite | TypeScript (strict) | xyflow | Zustand | TanStack Query | shadcn/ui | Tailwind CSS

---

## Setup

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`

---

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build (outputs to `dist/`)
- `npm run preview` — Preview production build locally
- `npm run typecheck` — Run TypeScript strict check (0 errors required)
- `npm run lint` — Run ESLint (0 errors required)

---

## Features

### Core
- **3 Service Nodes** (Redis, Postgres, Mongodb) with status indicators
- **Node Interactions:** Click to select, drag to move, Delete/Backspace to remove
- **Zoom + Pan:** Native ReactFlow canvas controls
- **Fit View Button:** Auto-zoom to all nodes

### Inspector (Right Panel)
- **Status Pill:** Health indicator (Healthy/Degraded/Down) with color coding
- **Tabs:** Config (edit name/description) + Runtime (load metrics)
- **Synced Slider + Input:** Change one → other updates instantly, 0–100 range
- **Editable Node Name:** Updates ReactFlow label in real-time
- **Tag Buttons:** CPU, Memory, Disk, Region (reference display)

### State Management
- **Zustand:** Lightweight store for UI state (selected app/node, mobile panel, active tab)
- **TanStack Query:** Handles mock API caching, loading/error states, refetch on app change
- **MockAPIs:**
  - `GET /api/apps` → App registry (500ms latency)
  - `GET /api/apps/:appId/graph` → Topology (800ms latency)

### Responsive Design
- **Desktop (>768px):** Static right panel, full canvas
- **Mobile (<768px):** Slide-over drawer toggle, full-width canvas

---

## Key Architectural Decisions

### 1. Why Zustand + TanStack Query (not Context or Redux)?
- **Zustand:** Lightweight, minimal boilerplate, perfect for UI state (selection, panel visibility, active tab)
- **TanStack Query:** Handles server state, caching, loading/error states without manual Promise handling
- **Separation:** UI state ≠ server state. Keep them separate = simpler, cleaner, more testable

### 2. Why NOT store graph in Zustand?
- Graph nodes/edges come from TanStack Query (server source of truth)
- ReactFlow manages its own canvas state (position, zoom, pan)
- Storing graph in Zustand would duplicate state + break reactivity
- Zustand only stores UI decisions (which node is selected, which app is active)

### 3. Why Custom Nodes (not default ReactFlow)?
- Default nodes don't show status badges + load meters
- Custom nodes give us control over rendering, styling, and data display
- Easier to extend (add node types, different icons, animations)

### 4. Why Mock APIs with setTimeout?
- No backend dependency
- Full control over latency, error injection, response shape
- Simulates real-world conditions (loading states, errors)
- Easy to swap for real API later (same `useQuery` interface)

### 5. Why Tailwind + HSL variables?
- Tailwind + custom HSL theme = dark/light mode without duplication
- HSL variables keep design tokens DRY and themeable

---

## Known Limitations

1. **Graph not persisted:** Graph edits (node deletion, position changes) reset on app switch or page refresh
   - *Fix (bonus):* Use LocalStorage or TanStack Query `setQueryData` for optimistic updates

2. **Mock error injection:** Error state is toggled via UI button, not random failures
   - *Production:* Real errors from API failures are handled the same way

3. **Add Node modal:** Creates node but doesn't persist to backend
   - *Fix (bonus):* POST to `/api/apps/:appId/nodes` (mock endpoint)

4. **No keyboard shortcuts yet:** Fit View only via button
   - *Bonus:* Add Ctrl+F → Fit View, Ctrl+L → Toggle Panel

---

## Project Structure

src/
├── components/
│   ├── Layout/
│   │   ├── TopBar.tsx          # Header: title, app selector, fit view, error toggle
│   │   ├── Sidebar.tsx         # Left nav: icon buttons
│   │   └── RightPanel.tsx      # Inspector panel (desktop/mobile drawer)
│   ├── Canvas/
│   │   ├── Graph.tsx           # ReactFlow canvas + interactions
│   │   └── CustomNode.tsx      # Custom node render with status/load
│   └── Inspector/
│       ├── Inspector.tsx       # Inspector container
│       ├── ConfigTab.tsx       # Node name, description
│       └── RuntimeTab.tsx      # Slider, numeric input (synced)
├── hooks/
│   ├── useApps.ts             # TanStack Query: GET /api/apps
│   └── useGraph.ts            # TanStack Query: GET /api/apps/:appId/graph
├── store/
│   └── appStore.ts            # Zustand: selected app/node, mobile panel, active tab
├── mocks/
│   └── handlers.ts            # Mock API endpoints with latency
├── types/
│   └── index.ts               # TypeScript interfaces (App, Node, Edge, Status, etc.)
├── App.tsx                    # Root component (provider setup, layout)
├── main.tsx                   # Entry point
└── index.css                  # Base styles, Tailwind, dark mode config
