# AI Agent Workflow Builder (React + React Flow)

This project gives you a visual editor similar to the n8n-style screenshot you shared:

- Trigger node: "When chat message received"
- AI Agent node with 3 sub-ports: Chat Model, Memory, Tool
- Separate "OpenAI Chat Model" and "Tool" nodes that connect into the AI Agent's bottom ports

## Features

- Drag nodes from the left palette: Trigger, AI Agent, Chat Model, Tool
- AI Agent node has 3 bottom connection points (model, memory, tool)
- Connect Chat Model / Tool nodes into the AI Agent
- Configure each node in the right-hand panel
- Live JSON preview of the workflow definition
- Export workflow as JSON

## Getting Started

```bash
cd frontend
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.