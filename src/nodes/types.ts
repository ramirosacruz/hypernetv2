
  export type FlowNode = {
  id: string;
  name: string;
  parentId?: string | null;
  type?: 'intent' | 'action' | 'condition';
  config?: any;
};

export type Snapshot = {
  nodes: FlowNode[];
};

export type CompiledIntent = {
  id: string;
  fullPath: string;
  nodeId: string;
};
