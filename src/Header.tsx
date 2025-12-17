import React from 'react';

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  inactive: boolean;
  onToggleInactive: () => void;
  onSave: () => void;
  onShare: () => void;
}

function Header({ activeTab, onTabChange, inactive, onToggleInactive, onSave, onShare }: Props) {
  const tabs = ['Editor', 'Executions', 'Evaluations'];
  return (
    <header
      style={{
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        borderBottom: '1px solid #e5e7eb',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#4b5563' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span role="img" aria-label="user">
              👤
            </span>
            Personal
          </span>
          <span>/</span>
          <a style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }} href="#">
            My workflow
          </a>
          <span>/</span>
          <a style={{ color: '#6b7280', textDecoration: 'none' }} href="#">
            + Add tag
          </a>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#f3f4f6',
            borderRadius: 10,
            padding: 4,
            gap: 6,
            fontSize: 13,
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => onTabChange(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#4b5563' }}>
            <span>Inactive</span>
            <div
              onClick={onToggleInactive}
              style={{
                width: 36,
                height: 18,
                borderRadius: 12,
                background: inactive ? '#d1d5db' : '#22c55e',
                position: 'relative',
                cursor: 'pointer',
              }}
            >
              <div
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#fff',
                  position: 'absolute',
                  top: 1,
                  left: inactive ? 1 : 19,
                  boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                  transition: 'left 0.15s ease',
                }}
              />
            </div>
          </div>
          <button className="btn" style={{ height: 34 }} onClick={onShare}>
            Share
          </button>
          <button className="btn btn-primary" style={{ height: 34 }} onClick={onSave}>
            Save
          </button>
          <button className="btn" style={{ borderRadius: '50%', width: 34, height: 34, padding: 0 }}>
            ⟳
          </button>
          <button className="btn" style={{ borderRadius: '50%', width: 34, height: 34, padding: 0 }}>
            ⋯
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
