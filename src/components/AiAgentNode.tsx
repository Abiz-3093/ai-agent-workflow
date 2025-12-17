import { Box, Card, Stack, Typography } from '@mui/material';
import { Handle, Position } from 'reactflow';

interface Props {
  data: {
    label: string;
    onAddModel?: () => void;
    onAddMemory?: () => void;
    onAddTool?: () => void;
  };
}

function AiAgentNode({ data }: Props) {
  const items = [
    { id: 'model', label: 'Chat Model*', onAdd: data.onAddModel },
    { id: 'memory', label: 'Memory', onAdd: data.onAddMemory },
    { id: 'tool', label: 'Tool', onAdd: data.onAddTool },
  ];

  return (
    <Card
      sx={{
        borderRadius: 3.5,
        border: '1.5px solid #cfd3d8',
        px: 2,
        py: 1.4,
        pb: 6,
        minWidth: 360,
        backgroundColor: '#fff',
        boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        style={{ background: '#6b7280', width: 14, height: 14, border: '1.5px solid #fff' }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        style={{ background: '#6b7280', width: 14, height: 14, border: '1.5px solid #fff' }}
      />

      <Stack direction="row" spacing={1} alignItems="center">
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: 2,
            background: '#0ea5e9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="6" y="5" width="12" height="10" rx="2" stroke="#fff" strokeWidth="1.6" />
            <path d="M9 18h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M9 8h6M9 11h6" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          {data.label || 'AI Agent'}
        </Typography>
      </Stack>

      {data.onDelete && (
        <Box
          component="button"
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.();
          }}
          aria-label="Delete node"
          sx={{
            position: 'absolute',
            top: 6,
            right: 8,
            all: 'unset',
            cursor: 'pointer',
            color: '#9ca3af',
            fontWeight: 800,
          }}
        >
          ×
        </Box>
      )}

      <Stack
        direction="row"
        spacing={3}
        justifyContent="space-between"
        alignItems="center"
        sx={{ position: 'absolute', bottom: -32, left: 32, right: 32 }}
      >
        {items.map((item, idx) => (
          <Box key={item.id} textAlign="center" sx={{ position: 'relative', minWidth: 72 }}>
            <Handle
              type="target"
              position={Position.Bottom}
              id={item.id}
              style={{
                left: '50%',
                background: '#6b64c5',
                border: '1px solid #312e81',
                width: 14,
                height: 14,
                transform: 'translate(-50%, 50%) rotate(45deg)',
              }}
            />
            <Typography variant="caption" sx={{ color: '#6b64c5', fontWeight: idx === 0 ? 700 : 600 }}>
              {item.label}
            </Typography>
            <Box sx={{ width: 2, height: 22, background: '#6b64c5', mx: 'auto', mt: 0.2 }} />
            <Box
              component="button"
              onClick={(e) => {
                e.stopPropagation();
                item.onAdd?.();
              }}
              disabled={!item.onAdd}
              style={{ all: 'unset', cursor: item.onAdd ? 'pointer' : 'default' }}
            >
              <Box
                sx={{
                  mt: 0.4,
                  width: 26,
                  height: 26,
                  borderRadius: 1,
                  border: '1.3px solid #6b64c5',
                  color: '#6b64c5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  fontWeight: 800,
                  fontSize: 16,
                  background: '#f6f7ff',
                  transition: 'all 0.15s ease',
                  '&:hover': { background: '#eef0ff' },
                  margin: '0px auto 0px'
                }}
              >
                +
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

export default AiAgentNode;
