import React from 'react';
import { Handle, Position } from 'reactflow';

type Props = {
  data: {
    label: string;
    onDelete?: () => void;
  };
};

function TriggerNode({ data }: Props) {
  return (
    <div
      style={{
        minWidth: 180,
        border: '1.5px solid #d1d5db',
        borderRadius: 20,
        padding: '12px 14px',
        background: '#fff',
        boxShadow: '0 6px 12px rgba(0,0,0,0.06)',
        position: 'relative',
        textAlign: 'center',
      }}
    >
      <Handle
        type="source"
        id="out"
        position={Position.Right}
        style={{ background: '#6b7280', width: 14, height: 14 }}
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
        >
          ×
        </button>
      )}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: '2px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto',
          fontSize: 22,
        }}
      >
        💬
      </div>
      <div style={{ marginTop: 6, fontSize: 13, fontWeight: 600, color: '#111827' }}>{data.label}</div>
    </div>
  );
}

export default TriggerNode;
