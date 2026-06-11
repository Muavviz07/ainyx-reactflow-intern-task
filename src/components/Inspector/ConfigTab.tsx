import React from 'react';
import { useAppStore } from '@/store/appStore';
import type { ServiceNode, NodeStatus } from '@/types';
import { Tag } from 'lucide-react';

interface ConfigTabProps {
  node: ServiceNode;
}

export const ConfigTab: React.FC<ConfigTabProps> = ({ node }) => {
  const updateNodeData = useAppStore((s) => s.updateNodeData);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(node.id, { label: e.target.value });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(node.id, { status: e.target.value as NodeStatus });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(node.id, { description: e.target.value });
  };

  // Standard predefined tags
  const availableTags = ['CPU', 'Memory', 'Disk', 'Region', 'US-East', 'EU-Central'];
  const currentTags = node.data.tags || [];

  const handleTagToggle = (tag: string) => {
    let nextTags: string[];
    if (currentTags.includes(tag)) {
      nextTags = currentTags.filter((t) => t !== tag);
    } else {
      nextTags = [...currentTags, tag];
    }
    updateNodeData(node.id, { tags: nextTags });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Node Label input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Node Name / Label
        </label>
        <input
          type="text"
          value={node.data.label}
          onChange={handleNameChange}
          placeholder="Rename service node..."
          className="h-9 w-full px-3 rounded-lg border border-border bg-accent/25 text-xs text-foreground focus:outline-none focus:border-primary transition-all font-semibold"
        />
      </div>

      {/* 2. Node Status dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Health Status
        </label>
        <select
          value={node.data.status}
          onChange={handleStatusChange}
          className="h-9 w-full px-2.5 rounded-lg border border-border bg-accent/25 text-xs text-foreground focus:outline-none focus:border-primary transition-all cursor-pointer font-medium"
        >
          <option value="Healthy" className="bg-popover text-green-500 font-semibold">Healthy</option>
          <option value="Degraded" className="bg-popover text-amber-500 font-semibold">Degraded</option>
          <option value="Down" className="bg-popover text-red-500 font-semibold">Down</option>
        </select>
      </div>

      {/* 3. Description textarea */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Service Description
        </label>
        <textarea
          value={node.data.description || ''}
          onChange={handleDescriptionChange}
          placeholder="Enter functional service details, endpoints, or debugging instructions..."
          rows={4}
          className="w-full p-3 rounded-lg border border-border bg-accent/25 text-xs text-foreground focus:outline-none focus:border-primary transition-all resize-none leading-relaxed"
        />
      </div>

      {/* 4. Interactive Tag Buttons */}
      <div className="flex flex-col gap-2 pt-2 border-t border-border/60">
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-muted-foreground" /> Topology Tags
        </span>
        <div className="flex flex-wrap gap-1.5">
          {availableTags.map((tag) => {
            const isSelected = currentTags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`text-[10px] px-2.5 py-1 rounded-md border font-semibold transition-all duration-150 ${
                  isSelected
                    ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                    : 'bg-card border-border hover:bg-accent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
