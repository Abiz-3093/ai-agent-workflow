import React from 'react';

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

function BottomBar({ collapsed, onToggle }: Props) {
  const tabStyle = (active?: boolean): React.CSSProperties => ({
    padding: '10px 14px',
    fontSize: 13,
    fontWeight: active ? 700 : 500,
    color: active ? '#ef4444' : '#4b5563',
    borderBottom: active ? '2px solid #ef4444' : '2px solid transparent',
    cursor: 'pointer',
  });

  return (
    <div className="footer-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div style={tabStyle(true)}>Chat</div>
        <div style={tabStyle()}>Session: ee953...</div>
        <div style={tabStyle()}>Logs</div>
      </div>
      <div style={{ fontSize: 16, color: '#6b7280', cursor: 'pointer' }} onClick={onToggle}>
        {collapsed ? '˅' : '˄'}
      </div>
    </div>
  );
}

export default BottomBar;
