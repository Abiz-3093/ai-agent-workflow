export type NodeKind = 'trigger' | 'action' | 'logic' | 'aiModel' | 'tool' | 'aiAgent' | 'memory';

export interface BaseNodeConfig {
  id: string;
  type: NodeKind;
  label: string;
  description?: string;
  position: {
    x: number;
    y: number;
  };
}

export interface TriggerNodeConfig extends BaseNodeConfig {
  type: 'trigger';
  triggerType: 'webhook' | 'cron' | 'manual';
}

export interface ActionNodeConfig extends BaseNodeConfig {
  type: 'action';
  app: string;
  operation: string;
}

export interface LogicNodeConfig extends BaseNodeConfig {
  type: 'logic';
  mode: 'if' | 'switch' | 'merge';
  expression?: string;
}

export interface AiModelNodeConfig extends BaseNodeConfig {
  type: 'aiModel';
  provider: 'openai' | 'azure' | 'custom';
  modelName: string;
  temperature: number;
}

export interface ToolNodeConfig extends BaseNodeConfig {
  type: 'tool';
  toolName: string;
}

export interface AiAgentNodeConfig extends BaseNodeConfig {
  type: 'aiAgent';
  systemPrompt?: string;
}

export interface MemoryNodeConfig extends BaseNodeConfig {
  type: 'memory';
  memoryType: 'buffer' | 'vector';
  storeName: string;
}

export type WorkflowNodeConfig =
  | TriggerNodeConfig
  | ActionNodeConfig
  | LogicNodeConfig
  | AiModelNodeConfig
  | ToolNodeConfig
  | AiAgentNodeConfig
  | MemoryNodeConfig;

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface WorkflowDefinition {
  id: string;
  name: string;
  nodes: WorkflowNodeConfig[];
  edges: WorkflowEdge[];
}
