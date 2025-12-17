import { Box, Card, CardActionArea, Divider, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import type { NodeKind } from '../types';
import type { Node } from 'reactflow';

type PaletteItem = {
  type: NodeKind;
  label: string;
  group: string;
};

interface Props {
  onAddNode?: (type: NodeKind, label: string) => void;
  selectedNode?: Node | null;
}

const palette: PaletteItem[] = [
  { type: 'trigger', label: 'Chat Trigger', group: 'Triggers' },
  { type: 'aiAgent', label: 'AI Agent', group: 'AI' },
  { type: 'aiModel', label: 'Chat Model', group: 'AI' },
  { type: 'memory', label: 'Memory', group: 'AI' },
  { type: 'tool', label: 'Tool', group: 'AI' },
  { type: 'action', label: 'HTTP Request', group: 'Actions' },
  { type: 'logic', label: 'If / Else', group: 'Logic' },
];

const typeFromLabel = (label: string): NodeKind => {
  const item = palette.find((p) => p.label === label);
  return item?.type || 'action';
};

function NodeSidebar({ onAddNode, selectedNode }: Props) {
  const [search, setSearch] = useState('');

  const groups = useMemo(() => {
    const lower = search.toLowerCase();
    const filtered = lower
      ? palette.filter((p) => p.label.toLowerCase().includes(lower) || p.group.toLowerCase().includes(lower))
      : palette;
    const byGroup: Record<string, PaletteItem[]> = {};
    filtered.forEach((p) => {
      byGroup[p.group] = byGroup[p.group] ? [...byGroup[p.group], p] : [p];
    });
    return byGroup;
  }, [search]);

  const handleDragStart = (event: React.DragEvent, label: string) => {
    const type = typeFromLabel(label);
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type, label }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <Box display="flex" flexDirection="column" gap={1} height="100%" overflow="hidden">
      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
        Nodes
      </Typography>
      <TextField
        size="small"
        placeholder="Search nodes"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        fullWidth
      />
      <Divider />
      <Box
        mb={1.2}
        px={1}
        py={1}
        sx={{
          border: '1px solid #e5e7eb',
          borderRadius: 1.4,
          background: '#f8fafc',
        }}
      >
        <Typography variant="caption" sx={{ fontWeight: 700, color: '#6b7280', display: 'block', mb: 0.6 }}>
          Selected
        </Typography>
        {selectedNode ? (
          <Box display="flex" flexDirection="column" gap={0.6}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>
              {selectedNode.data?.label || 'Untitled node'}
            </Typography>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              Type: {selectedNode.type}
            </Typography>
            {selectedNode.data?.description && (
              <Typography variant="caption" sx={{ color: '#4b5563' }}>
                {selectedNode.data.description}
              </Typography>
            )}
            {!selectedNode.data?.description && (
              <Typography variant="caption" sx={{ color: '#9ca3af' }}>
                No details provided yet.
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Click a card on the canvas to see its details.
          </Typography>
        )}
      </Box>
      <Box flex={1} overflow="auto" pr={0.5}>
        {Object.entries(groups).map(([group, items]) => (
          <Box key={group} mb={1.5}>
            <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: 700, textTransform: 'uppercase' }}>
              {group}
            </Typography>
            <Box display="flex" flexDirection="column" gap={0.6} mt={0.5}>
              {items.map((item) => (
                <Card
                  key={`${group}-${item.label}`}
                  sx={{ cursor: 'grab', border: '1px solid #e5e7eb' }}
                  draggable
                  onDragStart={(e) => handleDragStart(e as any, item.label)}
                >
                  <CardActionArea sx={{ px: 1.2, py: 0.9, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {item.label}
                    </Typography>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onAddNode?.(item.type, item.label);
                      }}
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        border: '1px solid #d1d5db',
                        background: '#f9fafb',
                        color: '#6b7280',
                        fontWeight: 800,
                        cursor: 'pointer',
                      }}
                      aria-label={`Add ${item.label}`}
                    >
                      +
                    </button>
                  </CardActionArea>
                </Card>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default NodeSidebar;
