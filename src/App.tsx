import React from 'react';
import { ReactFlowProvider } from 'reactflow';
import WorkflowCanvas from './components/WorkflowCanvas';

function App() {
  return (
    <div className="app">
      <div style={{ flex: 1, position: 'relative', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <ReactFlowProvider>
            <WorkflowCanvas onSave={(data) => console.log('Save from header', data)} />
          </ReactFlowProvider>
        </div>
      </div>
    </div>
  );
}

export default App;
