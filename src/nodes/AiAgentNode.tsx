import React from 'react';
import { Handle, Position } from 'reactflow';

type Props = {
  data: {
    label: string;
    onDelete?: () => void;
    onAddModel?: () => void;
    onAddMemory?: () => void;
    onAddTool?: () => void;
  };
};

function AiAgentNode({ data }: Props) {
  const items = [
    { id: 'model', label: 'Chat Model*', onAdd: data.onAddModel },
    { id: 'memory', label: 'Memory', onAdd: data.onAddMemory },
    { id: 'tool', label: 'Tool', onAdd: data.onAddTool },
  ];

  return (
    <div
      style={{
        minWidth: 360,
        border: '1.5px solid #cfd3d8',
        borderRadius: 16,
        padding: '14px 16px 46px 16px',
        background: '#fff',
        boxShadow: '0 6px 14px rgba(15,23,42,0.08)',
        position: 'relative',
      }}
    >
      <Handle
        type="target"
        id="in"
        position={Position.Left}
        style={{ background: '#6b7280', width: 14, height: 14, border: '1.5px solid #fff' }}
      />
      <Handle
        type="source"
        id="out"
        position={Position.Right}
        style={{ background: '#6b7280', width: 14, height: 14, border: '1.5px solid #fff' }}
      />

      {data.onDelete && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            data.onDelete?.();
          }}
          style={{
            position: 'absolute',
            top: 6,
            right: 8,
            border: 'none',
            background: 'transparent',
            color: '#9ca3af',
            fontWeight: 800,
            cursor: 'pointer',
          }}
          aria-label="Delete node"
        >
          ×
        </button>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 8,
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
        </div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>{data.label || 'AI Agent'}</div>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          left: 24,
          right: 24,
          bottom: -34,
        }}
      >
        {items.map((item, idx) => (
          <div key={item.id} style={{ position: 'relative', textAlign: 'center', minWidth: 72 }}>
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
            <div style={{ marginTop: 6, color: '#6b64c5', fontSize: 12, fontWeight: idx === 0 ? 700 : 600 }}>
              {item.label}
            </div>
            <div style={{ width: 2, height: 22, background: '#6b64c5', margin: '1px auto 0' }} />
            <button
              onClick={(e) => {
                e.stopPropagation();
                item.onAdd?.();
              }}
              disabled={!item.onAdd}
              style={{
                width: 28,
                height: 28,
                borderRadius: 6,
                border: '1.3px solid #6b64c5',
                color: '#6b64c5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '6px auto 0',
                fontWeight: 800,
                background: '#f6f7ff',
                cursor: item.onAdd ? 'pointer' : 'default',
              }}
              aria-label={`Add ${item.label}`}
            >
              +
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AiAgentNode;
