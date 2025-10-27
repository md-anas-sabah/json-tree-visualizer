import { Node, Edge } from 'reactflow';

interface TreeNode {
  id: string;
  label: string;
  type: 'object' | 'array' | 'primitive';
  value?: any;
  path: string;
  children?: TreeNode[];
}

export function parseJsonPath(path: string): string[] {
  // Convert $.user.address.city to ['user', 'address', 'city']
  // Convert items[0].name to ['items', '0', 'name']
  return path
    .replace(/^\$\.?/, '')
    .replace(/\[(\d+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
}

export function generateNodesAndEdges(data: any): {
  nodes: Node[];
  edges: Edge[];
} {
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  let nodeIdCounter = 0;

  function getNodeId(): string {
    return `node-${nodeIdCounter++}`;
  }

  function getNodeType(value: any): 'object' | 'array' | 'primitive' {
    if (Array.isArray(value)) return 'array';
    if (value !== null && typeof value === 'object') return 'object';
    return 'primitive';
  }

  function buildTree(
    value: any,
    key: string,
    path: string,
    parentId: string | null,
    level: number,
    indexInParent: number
  ): void {
    const nodeId = getNodeId();
    const nodeType = getNodeType(value);

    // Calculate position
    const x = indexInParent * 250;
    const y = level * 150;

    // Create node
    nodes.push({
      id: nodeId,
      type: 'custom',
      position: { x, y },
      data: {
        label: key,
        type: nodeType,
        value: nodeType === 'primitive' ? value : undefined,
        path: path,
        highlighted: false,
      },
    });

    // Create edge from parent
    if (parentId !== null) {
      edges.push({
        id: `edge-${parentId}-${nodeId}`,
        source: parentId,
        target: nodeId,
        type: 'smoothstep',
        animated: false,
      });
    }

    // Process children
    if (nodeType === 'object') {
      const keys = Object.keys(value);
      keys.forEach((childKey, index) => {
        const childPath = path ? `${path}.${childKey}` : `$.${childKey}`;
        buildTree(value[childKey], childKey, childPath, nodeId, level + 1, index);
      });
    } else if (nodeType === 'array') {
      value.forEach((item: any, index: number) => {
        const childPath = `${path}[${index}]`;
        buildTree(item, `[${index}]`, childPath, nodeId, level + 1, index);
      });
    }
  }

  // Start building from root
  const rootType = getNodeType(data);
  const rootLabel = rootType === 'object' ? 'root' : rootType === 'array' ? 'root[]' : 'value';

  buildTree(data, rootLabel, '$', null, 0, 0);

  // Auto-layout using a better algorithm
  const layoutNodes = autoLayout(nodes, edges);

  return { nodes: layoutNodes, edges };
}

function autoLayout(nodes: Node[], edges: Edge[]): Node[] {
  // Build adjacency list
  const childrenMap = new Map<string, string[]>();
  edges.forEach((edge) => {
    if (!childrenMap.has(edge.source)) {
      childrenMap.set(edge.source, []);
    }
    childrenMap.get(edge.source)!.push(edge.target);
  });

  // Find root node (node with no incoming edges)
  const targetIds = new Set(edges.map((e) => e.target));
  const rootNode = nodes.find((n) => !targetIds.has(n.id));

  if (!rootNode) return nodes;

  // Calculate layout using BFS
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));
  const positioned = new Set<string>();
  const levelGroups = new Map<number, string[]>();

  function bfs() {
    const queue: Array<{ id: string; level: number; parentX?: number }> = [
      { id: rootNode.id, level: 0 },
    ];
    positioned.add(rootNode.id);

    while (queue.length > 0) {
      const { id, level } = queue.shift()!;
      const children = childrenMap.get(id) || [];

      if (!levelGroups.has(level)) {
        levelGroups.set(level, []);
      }
      levelGroups.get(level)!.push(id);

      children.forEach((childId) => {
        if (!positioned.has(childId)) {
          positioned.add(childId);
          queue.push({ id: childId, level: level + 1 });
        }
      });
    }
  }

  bfs();

  // Position nodes
  const horizontalSpacing = 220;
  const verticalSpacing = 120;

  levelGroups.forEach((nodeIds, level) => {
    const levelWidth = (nodeIds.length - 1) * horizontalSpacing;
    const startX = -levelWidth / 2;

    nodeIds.forEach((nodeId, index) => {
      const node = nodeMap.get(nodeId)!;
      node.position = {
        x: startX + index * horizontalSpacing,
        y: level * verticalSpacing,
      };
    });
  });

  return Array.from(nodeMap.values());
}
