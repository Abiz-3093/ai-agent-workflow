import { Box, MenuItem, Slider, TextField, Typography } from '@mui/material';
import type {
  WorkflowNodeConfig,
  TriggerNodeConfig,
  ActionNodeConfig,
  LogicNodeConfig,
  AiModelNodeConfig,
  ToolNodeConfig,
  MemoryNodeConfig,
  AiAgentNodeConfig,
} from '../types';

interface Props {
  node: WorkflowNodeConfig | null;
  onChange: (node: WorkflowNodeConfig | null) => void;
}

function NodeConfigPanel({ node, onChange }: Props) {
  if (!node) {
    return <Typography variant="body2">Select a node to edit its configuration.</Typography>;
  }

  const updateBase = (patch: Partial<WorkflowNodeConfig>) => {
    onChange({ ...node, ...patch } as WorkflowNodeConfig);
  };

  const updateTrigger = (patch: Partial<TriggerNodeConfig>) => {
    onChange({ ...(node as TriggerNodeConfig), ...patch });
  };

  const updateAction = (patch: Partial<ActionNodeConfig>) => {
    onChange({ ...(node as ActionNodeConfig), ...patch });
  };

  const updateLogic = (patch: Partial<LogicNodeConfig>) => {
    onChange({ ...(node as LogicNodeConfig), ...patch });
  };

  const updateModel = (patch: Partial<AiModelNodeConfig>) => {
    onChange({ ...(node as AiModelNodeConfig), ...patch });
  };

  const updateTool = (patch: Partial<ToolNodeConfig>) => {
    onChange({ ...(node as ToolNodeConfig), ...patch });
  };

  const updateMemory = (patch: Partial<MemoryNodeConfig>) => {
    onChange({ ...(node as MemoryNodeConfig), ...patch });
  };

  const updateAgent = (patch: Partial<AiAgentNodeConfig>) => {
    onChange({ ...(node as AiAgentNodeConfig), ...patch });
  };

  return (
    <Box display="flex" flexDirection="column" gap={1}>
      <TextField
        size="small"
        label="Label"
        value={node.label}
        onChange={(e) => updateBase({ label: e.target.value })}
      />
      <TextField
        size="small"
        label="Description"
        value={node.description ?? ''}
        onChange={(e) => updateBase({ description: e.target.value })}
        multiline
        minRows={2}
      />

      {node.type === 'trigger' && (
        <>
          <TextField
            select
            size="small"
            label="Trigger type"
            value={(node as TriggerNodeConfig).triggerType}
            onChange={(e) => updateTrigger({ triggerType: e.target.value as TriggerNodeConfig['triggerType'] })}
          >
            <MenuItem value="webhook">Webhook</MenuItem>
            <MenuItem value="cron">Cron</MenuItem>
            <MenuItem value="manual">Manual</MenuItem>
          </TextField>
        </>
      )}

      {node.type === 'action' && (
        <>
          <TextField
            size="small"
            label="App"
            value={(node as ActionNodeConfig).app}
            onChange={(e) => updateAction({ app: e.target.value })}
          />
          <TextField
            size="small"
            label="Operation"
            value={(node as ActionNodeConfig).operation}
            onChange={(e) => updateAction({ operation: e.target.value })}
          />
        </>
      )}

      {node.type === 'logic' && (
        <>
          <TextField
            select
            size="small"
            label="Mode"
            value={(node as LogicNodeConfig).mode}
            onChange={(e) => updateLogic({ mode: e.target.value as LogicNodeConfig['mode'] })}
          >
            <MenuItem value="if">If</MenuItem>
            <MenuItem value="switch">Switch</MenuItem>
            <MenuItem value="merge">Merge</MenuItem>
          </TextField>
          <TextField
            size="small"
            label="Expression"
            value={(node as LogicNodeConfig).expression ?? ''}
            onChange={(e) => updateLogic({ expression: e.target.value })}
            multiline
            minRows={2}
          />
        </>
      )}

      {node.type === 'aiModel' && (
        <>
          <TextField
            select
            size="small"
            label="Provider"
            value={(node as AiModelNodeConfig).provider}
            onChange={(e) => updateModel({ provider: e.target.value as AiModelNodeConfig['provider'] })}
          >
            <MenuItem value="openai">OpenAI</MenuItem>
            <MenuItem value="azure">Azure</MenuItem>
            <MenuItem value="custom">Custom</MenuItem>
          </TextField>
          <TextField
            size="small"
            label="Model name"
            value={(node as AiModelNodeConfig).modelName}
            onChange={(e) => updateModel({ modelName: e.target.value })}
          />
          <Box px={0.5}>
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              Temperature
            </Typography>
            <Slider
              size="small"
              value={(node as AiModelNodeConfig).temperature}
              min={0}
              max={1}
              step={0.05}
              onChange={(_, v) => updateModel({ temperature: v as number })}
            />
          </Box>
        </>
      )}

      {node.type === 'tool' && (
        <>
          <TextField
            size="small"
            label="Tool name"
            value={(node as ToolNodeConfig).toolName}
            onChange={(e) => updateTool({ toolName: e.target.value })}
          />
        </>
      )}

      {node.type === 'memory' && (
        <>
          <TextField
            select
            size="small"
            label="Memory type"
            value={(node as MemoryNodeConfig).memoryType}
            onChange={(e) => updateMemory({ memoryType: e.target.value as MemoryNodeConfig['memoryType'] })}
          >
            <MenuItem value="buffer">Buffer</MenuItem>
            <MenuItem value="vector">Vector</MenuItem>
          </TextField>
          <TextField
            size="small"
            label="Store name"
            value={(node as MemoryNodeConfig).storeName}
            onChange={(e) => updateMemory({ storeName: e.target.value })}
          />
        </>
      )}

      {node.type === 'aiAgent' && (
        <>
          <TextField
            size="small"
            label="System prompt"
            value={(node as AiAgentNodeConfig).systemPrompt ?? ''}
            onChange={(e) => updateAgent({ systemPrompt: e.target.value })}
            multiline
            minRows={3}
          />
        </>
      )}
    </Box>
  );
}

export default NodeConfigPanel;
