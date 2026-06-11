# Ainyx Service Node Inspector

A production-grade React + TypeScript + Vite topology dashboard utilizing **xyflow (ReactFlow v12)**, **Zustand**, **TanStack Query v5**, and **Tailwind CSS v3**.

## Setup Instructions

Ensure you have Node.js (v18+) installed. Clone the repository and execute:

```bash
# 1. Install all dependencies
npm install

# 2. Start the Vite development server locally
npm run dev

# 3. Verify TypeScript compiling under strict mode
npm run typecheck

# 4. Verify ESLint runs and passes without any warnings or errors
npm run lint

# 5. Build production bundle assets
npm run build
```

The app will run locally at `http://localhost:5173`.

---

## Architectural Decisions

### 1. Zustand (Client/UI State) vs TanStack Query (Server State)
- **TanStack Query** handles **Server State**: fetching app lists (`/api/apps`) and topology graphs (`/api/apps/:id/graph`), managing caching lifecycle (`staleTime: 5 mins`), request loading spinners, and network retry errors.
- **Zustand** handles **Client/UI State**: selected node focus highlights, active configuration tabs, mobile side-drawer toggles, and *in-progress local modifications* of the active canvas (dragging, renaming nodes, updating slider values, and removing nodes).
- **Synchronization Strategy**: When a new app is selected, TanStack Query fetches the fresh topology. On success, we initialize the Zustand store's nodes and edges for the first time. Any subsequent updates (dragging, value sliders, renaming, and deleting) are handled instantly in Zustand to ensure immediate framerate responses.

### 2. Custom LocalStorage Persistence
To implement persistent topology edits, the mock API and the canvas synchronize with `localStorage`:
- The mock API (`mocks/handlers.ts`) checks `localStorage.getItem('graph-state:<appId>')` first. If found, it loads the user's edits; if not, it falls back to the default service map template.
- Moving, deleting, or updating nodes triggers a background synchronizer that saves the current state to localStorage, surviving page reloads.

---

## Evaluation Checklist Answers

### Q: Why did you use Zustand for X but TanStack Query for Y?
- **TanStack Query (Y)** is used to fetch, cache, and invalidate network data. It handles simulated API latency, loading screens, and retries.
- **Zustand (X)** is used to store local transient UI states (the active tab, selected node ID, mobile side-drawer toggle) and the operational state of the graph. Putting the active graph in Zustand allows ReactFlow and the Inspector component to access and mutate the same node data (renaming, load slider values) instantly without making network update requests on every keystroke.

### Q: Walk me through how a node gets deleted.
1. The user selects a node on the canvas and presses `Delete` or `Backspace`, or clicks the "Delete" trash icon in the Inspector.
2. If pressed on the canvas, ReactFlow's `onNodesDelete` event fires, which calls `deleteNode(nodeId)` in the Zustand store.
3. The `deleteNode` action:
   - Filters out the deleted node from `state.nodes`.
   - Filters out all connected input/output edges in `state.edges`.
   - Resets `selectedNodeId` to `null` if the deleted node was selected.
4. Zustand updates the store, triggering ReactFlow and the sidebar inspector to re-render.

### Q: How does the slider sync with the input?
Both the range slider and the numeric input are controlled components bound to the same Zustand state value:
```typescript
const value = node.data.value ?? 50;

const handleValueChange = (val: number) => {
  const num = isNaN(val) ? 0 : val;
  const clamped = Math.max(0, Math.min(100, num));
  updateNodeData(node.id, { value: clamped });
};

// Slider Control
<input type="range" min="0" max="100" value={value} onChange={(e) => handleValueChange(Number(e.target.value))} />

// Synced Numeric Input Control
<input type="number" min="0" max="100" value={value} onChange={(e) => handleValueChange(Number(e.target.value))} />
```
Because they mutate the same source of truth in the store, updating one updates the other instantly.

### Q: How does the mobile drawer toggle work?
- On screens `<768px`, we use standard tailwind responsive breakpoint utility hidden classes to hide the desktop panel (`hidden md:flex`).
- The mobile drawer is controlled by `isMobilePanelOpen` in Zustand.
- Clicking the header hamburger menu button toggles `isMobilePanelOpen`. When `true`, it displays a floating side-drawer overlay and backdrop. Selecting a node automatically opens the drawer.

### Q: What happens when `selectedAppId` changes?
1. Selecting a new app in the TopBar selector triggers `setSelectedAppId(id)` in Zustand.
2. Zustand resets the selected node to `null` and empties the active `nodes` and `edges` arrays.
3. The TanStack Query hook `useGraph(appId)` detects the new query key, launching a network request with simulated latency.
4. When the query resolves, the Graph component detects the mismatch between `loadedAppId` and `selectedAppId` inside a `useEffect`, loading the new topology coordinates into Zustand, triggering a `fitView` animation, and mapping `loadedAppId` to `selectedAppId`.

---

## Bonus Features Implemented

1. **Add Node Wizard**: A floating action button opens a modal to create new service/database nodes with custom labels, status, and CPU loads.
2. **Type Differentiation**: Databases and Services render distinct primary icons and border highlights (purple database vs blue service).
3. **Keyboard Shortcuts**:
   - `Ctrl + F`: Smoothly auto-zoom and center to fit the entire graph view.
   - `Ctrl + L`: Toggle mobile panel/drawer state.
4. **LocalStorage Persistence**: Local graph edits (dragging nodes, editing labels, sliders, adding, and deleting nodes) persist across browser reloads.
