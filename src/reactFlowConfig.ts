import { Node, Edge } from 'reactflow';
import AiAgentNode from './nodes/AiAgentNode';
import TriggerNode from './nodes/TriggerNode';
import NodeCard from './components/NodeCard';

export type NodeKind = 'trigger' | 'aiAgent' | 'aiModel' | 'memory' | 'tool';

export const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 160, y: 240 },
    data: { label: 'When chat message received', type: 'trigger' },
  },
  {
    id: 'agent-1',
    type: 'aiAgent',
    position: { x: 520, y: 240 },
    data: { label: 'AI Agent' },
  },
];

export const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: 'trigger-1',
    target: 'agent-1',
    animated: false,
    style: { strokeWidth: 2, stroke: '#6b7280' },
    markerEnd: { type: 'arrowclosed', color: '#6b7280' },
  },
];

export const nodeTypes = {
  trigger: TriggerNode,
  aiAgent: AiAgentNode,
  aiModel: NodeCard,
  memory: NodeCard,
  tool: NodeCard,
  action: NodeCard,
  logic: NodeCard,
};
