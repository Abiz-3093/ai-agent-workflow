import React from 'react';

function LeftSidebar() {
  const buttonStyle: React.CSSProperties = {
    width: 42,
    height: 42,
    borderRadius: 10,
    border: '1px solid #d1d5db',
    background: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    cursor: 'pointer',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  };

  return (
    <aside
      style={{
        width: 72,
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '12px 10px',
        gap: 12,
        background: '#fff',
      }}
    >
      <button style={{ ...buttonStyle, width: 48, height: 48, fontSize: 20 }}>＋</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
        <button style={buttonStyle}>🏠</button>
        <button style={buttonStyle}>👤</button>
        <button style={buttonStyle}>🧭</button>
      </div>
      <div style={{ flex: 1 }} />
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'linear-gradient(135deg,#7c3aed,#f472b6)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          fontSize: 14,
        }}
      >
        AB
      </div>
    </aside>
  );
}

export default LeftSidebar;
