import React from 'react';

interface Props {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFit: () => void;
  onDuplicate: () => void;
  onMagic: () => void;
}

function RightToolbar({ onZoomIn, onZoomOut, onFit, onDuplicate, onMagic }: Props) {
  const buttonStyle: React.CSSProperties = {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  };

  return (
    <aside
      style={{
        width: 64,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        padding: '10px 8px',
        pointerEvents: 'auto',
      }}
    >
      <button style={buttonStyle} onClick={onZoomIn} title="Zoom in">
        ＋
      </button>
      <button style={buttonStyle} onClick={onZoomOut} title="Zoom out">
        －
      </button>
      <button style={buttonStyle} onClick={onFit} title="Fit">
        🗺️
      </button>
      <button style={buttonStyle} onClick={onDuplicate} title="Duplicate workflow">
        📄
      </button>
      <button style={buttonStyle} onClick={onMagic} title="Magic">
        ✨
      </button>
    </aside>
  );
}

export default RightToolbar;
