import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Connection,
  Edge,
  MiniMap,
  addEdge,
  MarkerType,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import NodeSidebar from './NodeSidebar';
import { nodeTypes, initialNodes, initialEdges } from '../reactFlowConfig';
import type { NodeKind } from '../types';

interface Props {
  onSave?: (data: { nodes: any[]; edges: Edge[] }) => void;
}

type AgentConfig = {
  chatModel?: { model: string; guardrail: string };
  memory?: { type: string; notes: string };
  tool?: { name: string; description: string };
};

type ActivePrompt = { type: 'aiModel' | 'memory' | 'tool'; label: string; agentId?: string; nodeId?: string };

const modelOptions = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'custom'];
const memoryOptions = ['buffer', 'vector', 'redis', 'postgres'];

function WorkflowCanvas({ onSave }: Props) {
  const { fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeIds, setSelectedEdgeIds] = useState<string[]>([]);
  const [activePrompt, setActivePrompt] = useState<ActivePrompt | null>(null);
  const [agentConfigs, setAgentConfigs] = useState<Record<string, AgentConfig>>({});
  const [chatModelForm, setChatModelForm] = useState({ model: 'gpt-4o', guardrail: '' });
  const [memoryForm, setMemoryForm] = useState({ type: 'buffer', notes: '' });
  const [toolForm, setToolForm] = useState({ name: '', description: '' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showJson, setShowJson] = useState(false);
  const lastKeyDown = useRef<number>(0);

  const selectedNode = useMemo(() => nodes.find((n) => n.id === selectedNodeId), [nodes, selectedNodeId]);
  const workflowJson = useMemo(() => ({ nodes, edges, agentConfigs }), [agentConfigs, edges, nodes]);

  const openPrompt = useCallback((kind: 'aiModel' | 'memory' | 'tool', agentId?: string, nodeId?: string) => {
    const label = kind === 'aiModel' ? 'Chat Model' : kind === 'memory' ? 'Memory' : 'Tool';
    setActivePrompt({ type: kind, label, agentId, nodeId });
  }, []);

  const persistAgentConfig = useCallback((agentId: string, patch: Partial<AgentConfig>) => {
    setAgentConfigs((prev) => ({ ...prev, [agentId]: { ...(prev[agentId] || {}), ...patch } }));
  }, []);

  const removeAgentConfig = useCallback((agentId: string) => {
    setAgentConfigs((prev) => {
      if (!prev[agentId]) return prev;
      const next = { ...prev };
      delete next[agentId];
      return next;
    });
  }, []);

  const removeChildConfig = useCallback(
    (childId: string) => {
      const edge = edges.find((e) => e.source === childId);
      if (!edge) return;
      const agentId = edge.target;
      const handle = edge.targetHandle;
      setAgentConfigs((prev) => {
        const existing = prev[agentId];
        if (!existing) return prev;
        const nextAgent = { ...existing };
        if (handle === 'model') delete nextAgent.chatModel;
        if (handle === 'memory') delete nextAgent.memory;
        if (handle === 'tool') delete nextAgent.tool;
        if (!nextAgent.chatModel && !nextAgent.memory && !nextAgent.tool) {
          const next = { ...prev };
          delete next[agentId];
          return next;
        }
        return { ...prev, [agentId]: nextAgent };
      });
    },
    [edges],
  );

  const findAgentForChild = useCallback(
    (nodeId: string) => {
      const edge = edges.find((e) => e.source === nodeId);
      return edge?.target ?? null;
    },
    [edges],
  );

  const findChildNodeId = useCallback(
    (agentId: string, kind: 'aiModel' | 'memory' | 'tool') => {
      const handle = kind === 'aiModel' ? 'model' : kind;
      const edge = edges.find((e) => e.target === agentId && e.targetHandle === handle);
      return edge?.source;
    },
    [edges],
  );

  useEffect(() => {
    if (activePrompt?.type === 'aiModel' && activePrompt.agentId) {
      const existing = agentConfigs[activePrompt.agentId]?.chatModel;
      setChatModelForm({ model: existing?.model ?? 'gpt-4o', guardrail: existing?.guardrail ?? '' });
    }
    if (activePrompt?.type === 'memory' && activePrompt.agentId) {
      const existing = agentConfigs[activePrompt.agentId]?.memory;
      setMemoryForm({ type: existing?.type ?? 'buffer', notes: existing?.notes ?? '' });
    }
    if (activePrompt?.type === 'tool' && activePrompt.agentId) {
      const existing = agentConfigs[activePrompt.agentId]?.tool;
      setToolForm({ name: existing?.name ?? '', description: existing?.description ?? '' });
    }
  }, [activePrompt, agentConfigs]);

  const addPaletteNode = useCallback(
    (type: NodeKind, label: string) => {
      const id = `${type}-${Date.now()}`;
      const position = { x: 220 + Math.random() * 240, y: 140 + Math.random() * 260 };
      const newNode = {
        id,
        type,
        position,
        data: { label, type },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
      if (type === 'aiModel' || type === 'memory' || type === 'tool') {
        openPrompt(type);
      } else {
        setActivePrompt(null);
      }
    },
    [openPrompt, setNodes],
  );

  const handleDelete = useCallback(() => {
    if (selectedNodeId) {
      const selected = nodes.find((n) => n.id === selectedNodeId);
      if (selected?.type === 'aiAgent') {
        removeAgentConfig(selectedNodeId);
      }
      if (selected?.type === 'aiModel' || selected?.type === 'memory' || selected?.type === 'tool') {
        removeChildConfig(selectedNodeId);
      }
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    }
    if (selectedEdgeIds.length) {
      setEdges((eds) => eds.filter((e) => !selectedEdgeIds.includes(e.id)));
      setSelectedEdgeIds([]);
    }
  }, [nodes, removeAgentConfig, removeChildConfig, selectedEdgeIds, selectedNodeId, setEdges, setNodes]);

  const onConnect = useCallback(
    (connection: Connection) => {
      const edge: Edge = {
        ...connection,
        id: `edge-${Date.now()}`,
        markerEnd: { type: MarkerType.ArrowClosed, color: '#6b7280', width: 16, height: 16 },
        style: { stroke: '#6b7280', strokeWidth: 2 },
      } as Edge;
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  const addChild = useCallback(
    (agentId: string, kind: 'aiModel' | 'memory' | 'tool') => {
      const agent = nodes.find((n) => n.id === agentId);
      if (!agent) return;
      const baseX = agent.position?.x ?? 0;
      const baseY = agent.position?.y ?? 0;
      const offset = kind === 'aiModel' ? -80 : kind === 'memory' ? 0 : 80;
      const position = { x: baseX + offset, y: baseY + 170 };
      const id = `${kind}-${Date.now()}`;
      const label = kind === 'aiModel' ? 'Chat Model*' : kind === 'memory' ? 'Memory' : 'Tool';
      const newNode = {
        id,
        type: kind,
        position,
        data: {
          label,
          type: kind,
          onDelete: () => {
            removeChildConfig(id);
            setNodes((nds) => nds.filter((node) => node.id !== id));
            setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
            setSelectedNodeId((prev) => (prev === id ? null : prev));
          },
        },
      };
      const newEdge: Edge = {
        id: `edge-${id}`,
        source: id,
        target: agentId,
        sourceHandle: 'out',
        targetHandle: kind === 'aiModel' ? 'model' : kind,
        markerEnd: { type: 'arrowclosed', color: '#6b7280', width: 16, height: 16 },
        style: { stroke: '#6b7280', strokeWidth: 2 },
      };
      setNodes((nds) => [...nds, newNode]);
      setEdges((eds) => [...eds, newEdge]);
      openPrompt(kind, agentId, id);
    },
    [handleDelete, nodes, openPrompt, removeChildConfig, setEdges, setNodes],
  );

  const decoratedNodes = useMemo(
    () =>
      nodes.map((n) =>
        n.type === 'aiAgent'
          ? {
              ...n,
              data: {
                ...(n.data || {}),
                onDelete: () => {
                  removeAgentConfig(n.id);
                  setSelectedNodeId((prev) => (prev === n.id ? null : prev));
                  setNodes((nds) => nds.filter((node) => node.id !== n.id));
                  setEdges((eds) => eds.filter((e) => e.source !== n.id && e.target !== n.id));
                },
                onAddModel: () => addChild(n.id, 'aiModel'),
                onAddMemory: () => addChild(n.id, 'memory'),
                onAddTool: () => addChild(n.id, 'tool'),
              },
            }
          : {
              ...n,
              data: {
                ...(n.data || {}),
                onDelete: () => {
                  removeChildConfig(n.id);
                  setNodes((nds) => nds.filter((node) => node.id !== n.id));
                  setEdges((eds) => eds.filter((e) => e.source !== n.id && e.target !== n.id));
                  setSelectedNodeId((prev) => (prev === n.id ? null : prev));
                },
              },
            },
      ),
    [addChild, nodes, removeAgentConfig, removeChildConfig, setEdges, setNodes],
  );

  const onSelectionChange = useCallback(
    ({ nodes: selNodes = [], edges: selEdges = [] }: { nodes: any[]; edges: any[] }) => {
      const first = selNodes[0];
      setSelectedNodeId(first?.id ?? null);
      setSelectedEdgeIds(selEdges.map((e: any) => e.id));
      if (first?.type === 'aiModel' || first?.type === 'memory' || first?.type === 'tool') {
        const agentId = findAgentForChild(first.id);
        openPrompt(first.type, agentId ?? undefined, first.id);
      } else if (!first) {
        setActivePrompt(null);
      } else {
        setActivePrompt(null);
      }
    },
    [findAgentForChild, openPrompt],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const now = Date.now();
        if (now - lastKeyDown.current < 120) return;
        lastKeyDown.current = now;
        handleDelete();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleDelete]);

  const onNodesDelete = useCallback(
    (deleted: any[]) => {
      deleted.forEach((d) => {
        if (d.type === 'aiAgent') {
          removeAgentConfig(d.id);
        }
        if (d.type === 'aiModel' || d.type === 'memory' || d.type === 'tool') {
          removeChildConfig(d.id);
        }
      });
      const ids = deleted.map((d) => d.id);
      setEdges((eds) => eds.filter((e) => !ids.includes(e.source) && !ids.includes(e.target)));
    },
    [removeAgentConfig, removeChildConfig, setEdges],
  );

  const onSaveClick = useCallback(() => {
    onSave?.({ nodes, edges });
    console.log('Workflow saved', { nodes, edges, agentConfigs });
  }, [agentConfigs, edges, nodes, onSave]);

  const saveChatModel = useCallback(() => {
    if (!activePrompt?.agentId) return;
    persistAgentConfig(activePrompt.agentId, { chatModel: { ...chatModelForm } });
    setActivePrompt(null);
  }, [activePrompt, chatModelForm, persistAgentConfig]);

  const saveMemory = useCallback(() => {
    if (!activePrompt?.agentId) return;
    persistAgentConfig(activePrompt.agentId, { memory: { ...memoryForm } });
    setActivePrompt(null);
  }, [activePrompt, memoryForm, persistAgentConfig]);

  const saveTool = useCallback(() => {
    if (!activePrompt?.agentId) return;
    persistAgentConfig(activePrompt.agentId, { tool: { ...toolForm } });
    setActivePrompt(null);
  }, [activePrompt, toolForm, persistAgentConfig]);

  const selectedAgentConfig = useMemo(() => {
    if (selectedNode?.type !== 'aiAgent' || !selectedNode?.id) return null;
    return agentConfigs[selectedNode.id] || null;
  }, [agentConfigs, selectedNode]);

  const activeAgentLabel = useMemo(() => {
    if (!activePrompt?.agentId) return null;
    return nodes.find((n) => n.id === activePrompt.agentId)?.data?.label ?? activePrompt.agentId;
  }, [activePrompt, nodes]);

  const inputStyle = useMemo(
    () => ({
      width: '100%',
      padding: '8px 10px',
      border: '1px solid #d1d5db',
      borderRadius: 8,
      fontSize: 13,
    }),
    [],
  );

  return (
    <div style={{ display: 'flex', height: '100%', position: 'relative' }}>
      <div
        style={{
          width: sidebarOpen ? 260 : 52,
          borderRight: '1px solid #e5e7eb',
          background: '#fff',
          padding: sidebarOpen ? 10 : 6,
          overflow: 'hidden',
          transition: 'width 0.18s ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        <button
          onClick={() => setSidebarOpen((v) => !v)}
          style={{
            width: '100%',
            borderRadius: 10,
            border: '1px solid #e5e7eb',
            background: '#f9fafb',
            color: '#4b5563',
            fontSize: 12,
            padding: sidebarOpen ? '8px 10px' : '8px 6px',
            cursor: 'pointer',
          }}
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? 'Collapse' : '>'}
        </button>
        {sidebarOpen && <NodeSidebar onAddNode={addPaletteNode} selectedNode={selectedNode ?? null} />}
      </div>

      <div className="canvas-bg" style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={decoratedNodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          onNodesDelete={onNodesDelete}
          fitView
          panOnScroll
        >
          <MiniMap />
          <Controls />
          <Background variant="dots" gap={18} size={1} color="#d9dee6" />
        </ReactFlow>

        <div style={{ position: 'absolute', right: 12, top: 12, display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => setShowJson(true)}>
            View JSON
          </button>
        </div>

        <div style={{ position: 'absolute', left: 12, bottom: 12 }}>
          <button className="btn" onClick={onSaveClick}>
            Save workflow (console)
          </button>
        </div>
      </div>

      <div
        style={{
          width: 280,
          borderLeft: '1px solid #e5e7eb',
          background: '#fff',
          padding: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontWeight: 700 }}>Details</div>
          {activePrompt && (
            <button className="prompt-close" onClick={() => setActivePrompt(null)} aria-label="Close prompt">
              ×
            </button>
          )}
        </div>

        {activePrompt ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {activePrompt.label}
              </div>
              <div style={{ fontWeight: 700 }}>
                {activePrompt.agentId ? `Configuring ${activeAgentLabel || 'AI Agent'}` : 'Attach to an AI Agent to save'}
              </div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                {activePrompt.agentId
                  ? 'Update values and hit save to store them on this agent.'
                  : 'Select or create an AI Agent, then add a connection so we know where to store these details.'}
              </div>
            </div>

            {activePrompt.type === 'aiModel' && (
              <>
                <label style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Model</label>
                <select
                  value={chatModelForm.model}
                  onChange={(e) => setChatModelForm((prev) => ({ ...prev, model: e.target.value }))}
                  style={inputStyle}
                >
                  {modelOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Guardrail</label>
                <input
                  value={chatModelForm.guardrail}
                  onChange={(e) => setChatModelForm((prev) => ({ ...prev, guardrail: e.target.value }))}
                  style={inputStyle}
                  placeholder="e.g. Block PII or keep responses under 200 chars"
                />

                <button
                  className="btn btn-primary"
                  onClick={saveChatModel}
                  disabled={!activePrompt.agentId}
                  style={{ marginTop: 4 }}
                  title={!activePrompt.agentId ? 'Connect this chat model to an AI Agent first' : undefined}
                >
                  Save chat model
                </button>
              </>
            )}

            {activePrompt.type === 'memory' && (
              <>
                <label style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Memory type</label>
                <select
                  value={memoryForm.type}
                  onChange={(e) => setMemoryForm((prev) => ({ ...prev, type: e.target.value }))}
                  style={inputStyle}
                >
                  {memoryOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <label style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Notes / location</label>
                <input
                  value={memoryForm.notes}
                  onChange={(e) => setMemoryForm((prev) => ({ ...prev, notes: e.target.value }))}
                  style={inputStyle}
                  placeholder="e.g. redis://localhost:6379 or keep last 20 messages"
                />

                <button
                  className="btn btn-primary"
                  onClick={saveMemory}
                  disabled={!activePrompt.agentId}
                  style={{ marginTop: 4 }}
                  title={!activePrompt.agentId ? 'Connect this memory node to an AI Agent first' : undefined}
                >
                  Save memory
                </button>
              </>
            )}

            {activePrompt.type === 'tool' && (
              <>
                <label style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Tool name</label>
                <input
                  value={toolForm.name}
                  onChange={(e) => setToolForm((prev) => ({ ...prev, name: e.target.value }))}
                  style={inputStyle}
                  placeholder="e.g. Weather API"
                />

                <label style={{ fontSize: 12, color: '#374151', fontWeight: 600 }}>Description</label>
                <textarea
                  value={toolForm.description}
                  onChange={(e) => setToolForm((prev) => ({ ...prev, description: e.target.value }))}
                  style={{ ...inputStyle, minHeight: 70 }}
                  placeholder="What does this tool do and how should the agent call it?"
                />

                <button
                  className="btn btn-primary"
                  onClick={saveTool}
                  disabled={!activePrompt.agentId}
                  style={{ marginTop: 4 }}
                  title={!activePrompt.agentId ? 'Connect this tool node to an AI Agent first' : undefined}
                >
                  Save tool
                </button>
              </>
            )}
          </div>
        ) : selectedNode?.type === 'aiAgent' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontWeight: 700 }}>{selectedNode.data?.label || 'AI Agent'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Review and edit what is attached to this agent.</div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Chat model</div>
              {selectedAgentConfig?.chatModel ? (
                <>
                  <div style={{ fontSize: 12, color: '#374151' }}>Model: {selectedAgentConfig.chatModel.model}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>
                    Guardrail: {selectedAgentConfig.chatModel.guardrail || 'Not set'}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Not configured yet.</div>
              )}
              <button
                className="btn"
                onClick={() => openPrompt('aiModel', selectedNode.id, findChildNodeId(selectedNode.id, 'aiModel'))}
                style={{ alignSelf: 'flex-start' }}
              >
                {selectedAgentConfig?.chatModel ? 'Edit chat model' : 'Add chat model'}
              </button>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Memory</div>
              {selectedAgentConfig?.memory ? (
                <>
                  <div style={{ fontSize: 12, color: '#374151' }}>Type: {selectedAgentConfig.memory.type}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>
                    Notes: {selectedAgentConfig.memory.notes || 'Not set'}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Not configured yet.</div>
              )}
              <button
                className="btn"
                onClick={() => openPrompt('memory', selectedNode.id, findChildNodeId(selectedNode.id, 'memory'))}
                style={{ alignSelf: 'flex-start' }}
              >
                {selectedAgentConfig?.memory ? 'Edit memory' : 'Add memory'}
              </button>
            </div>

            <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 700, fontSize: 13 }}>Tool</div>
              {selectedAgentConfig?.tool ? (
                <>
                  <div style={{ fontSize: 12, color: '#374151' }}>Name: {selectedAgentConfig.tool.name || 'Untitled tool'}</div>
                  <div style={{ fontSize: 12, color: '#374151' }}>
                    Description: {selectedAgentConfig.tool.description || 'Not set'}
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: '#9ca3af' }}>Not configured yet.</div>
              )}
              <button
                className="btn"
                onClick={() => openPrompt('tool', selectedNode.id, findChildNodeId(selectedNode.id, 'tool'))}
                style={{ alignSelf: 'flex-start' }}
              >
                {selectedAgentConfig?.tool ? 'Edit tool' : 'Add tool'}
              </button>
            </div>
          </div>
        ) : selectedNode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ fontWeight: 700 }}>{selectedNode.data?.label || 'Untitled node'}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Type: {selectedNode.type}</div>
            {selectedNode.data?.description ? (
              <div style={{ fontSize: 12, color: '#4b5563' }}>{selectedNode.data.description}</div>
            ) : (
              <div style={{ fontSize: 12, color: '#9ca3af' }}>No details provided.</div>
            )}
          </div>
        ) : (
          <div style={{ fontSize: 12, color: '#9ca3af' }}>Select a node to see details.</div>
        )}
      </div>

      {showJson && (
        <div className="modal-backdrop" onClick={() => setShowJson(false)}>
          <div className="modal" style={{ width: 540, maxHeight: '80vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ fontWeight: 700 }}>Workflow JSON</div>
              <button className="btn" onClick={() => setShowJson(false)} style={{ padding: '4px 8px' }}>
                Close
              </button>
            </div>
            <pre
              style={{
                margin: 0,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                padding: 12,
                fontSize: 12,
                lineHeight: 1.4,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
{JSON.stringify(workflowJson, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkflowCanvas;
