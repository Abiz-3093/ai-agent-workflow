import { Box, Card, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';
import type { NodeKind } from '../types';

interface Props {
  data: {
    label: string;
    type: NodeKind;
    onDelete?: () => void;
  };
}

const colors: Record<NodeKind, { border: string; bg: string; iconBg: string }> = {
  trigger: { border: '#06b6d4', bg: '#ecfeff', iconBg: '#06b6d4' },
  action: { border: '#8b5cf6', bg: '#f5f3ff', iconBg: '#8b5cf6' },
  logic: { border: '#10b981', bg: '#ecfdf3', iconBg: '#10b981' },
  aiModel: { border: '#2563eb', bg: '#eff6ff', iconBg: '#2563eb' },
  tool: { border: '#f59e0b', bg: '#fffbeb', iconBg: '#f59e0b' },
  aiAgent: { border: '#6b7280', bg: '#fff', iconBg: '#0ea5e9' },
  memory: { border: '#7c3aed', bg: '#f5f3ff', iconBg: '#7c3aed' },
};

const Icon: React.FC<{ type: NodeKind }> = ({ type }) => {
  const baseColor = colors[type].iconBg;
  switch (type) {
    case 'trigger':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="5" width="14" height="14" rx="3" stroke="#fff" strokeWidth="1.8" />
          <path d="M9 12h6" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case 'logic':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M7 7h10M7 17h10" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="9" cy="12" r="1.5" fill="#fff" />
          <circle cx="15" cy="12" r="1.5" fill="#fff" />
        </svg>
      );
    case 'aiModel':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="3" stroke="#fff" strokeWidth="1.6" />
          <path d="M7 19c.5-2 2.5-3 5-3s4.5 1 5 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case 'tool':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="m8 8 8 8m0-8-8 8M4 12h3m10 0h3M12 4v3m0 10v3"
            stroke="#fff"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case 'memory':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="6" width="14" height="12" rx="2" stroke="#fff" strokeWidth="1.6" />
          <path d="M9 9h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 13h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M8 5h8a1 1 0 0 1 1 1v12l-5-3-5 3V6a1 1 0 0 1 1-1Z" stroke="#fff" strokeWidth="1.6" />
        </svg>
      );
  }
};

function NodeCard({ data }: Props) {
  const palette = colors[data.type];
  return (
    <Card
      sx={{
        borderRadius: 3,
        border: `1.5px solid ${palette.border}`,
        minWidth: 200,
        px: 1.8,
        py: 1.2,
        background: '#fff',
        boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
        position: 'relative',
      }}
    >
      <Handle type="target" position={Position.Left} id="in" style={{ background: '#6b7280' }} />
      <Handle type="source" position={Position.Right} id="out-right" style={{ background: '#6b7280' }} />
      <Handle type="source" position={Position.Top} id="out" style={{ background: '#6b7280' }} />

      {data.onDelete && (
        <Box
          component="button"
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.();
          }}
          sx={{
            all: 'unset',
            cursor: 'pointer',
            position: 'absolute',
            top: 6,
            right: 8,
            fontWeight: 800,
            color: '#9ca3af',
          }}
        >
          ×
        </Box>
      )}

      <Box display="flex" alignItems="center" gap={1}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            background: palette.iconBg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon type={data.type} />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {data.label}
        </Typography>
      </Box>
    </Card>
  );
}

export default NodeCard;
