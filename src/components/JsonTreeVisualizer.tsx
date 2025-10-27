/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Panel,
  ReactFlowProvider,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';
import { parseJsonPath, generateNodesAndEdges } from '@/utils/jsonTreeUtils';

interface JsonTreeVisualizerProps {
  jsonData: any;
  searchPath: string;
  onSearchPathChange: (path: string) => void;
}

function JsonTreeVisualizerContent({
  jsonData,
  searchPath,
  onSearchPathChange,
}: JsonTreeVisualizerProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchMessage, setSearchMessage] = useState('');
  const { fitView, setCenter } = useReactFlow();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  useEffect(() => {
    if (jsonData) {
      const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(jsonData);
      setNodes(newNodes);
      setEdges(newEdges);
      setTimeout(() => fitView({ padding: 0.2 }), 50);
    }
  }, [jsonData, setNodes, setEdges, fitView]);

  const handleSearch = useCallback(() => {
    if (!searchInput.trim()) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          data: { ...node.data, highlighted: false },
        }))
      );
      setSearchMessage('');
      return;
    }

    const matchedNode = nodes.find((node) => {
      const nodePath = node.data.path;
      return nodePath === searchInput || nodePath.endsWith(searchInput);
    });

    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          highlighted: node.id === matchedNode?.id,
        },
      }))
    );

    if (matchedNode) {
      setSearchMessage('Match found');
      setCenter(matchedNode.position.x + 100, matchedNode.position.y + 25, {
        zoom: 1.5,
        duration: 800,
      });
    } else {
      setSearchMessage('No match found');
    }
  }, [searchInput, nodes, setNodes, setCenter]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden h-[600px]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.1}
        maxZoom={2}
      >
        <Background />
        <Controls />

        <Panel position="top-left" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md m-4">
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search by JSON path (e.g., $.user.name)"
              className="w-64 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
                       text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium
                       rounded-lg transition-colors duration-200"
            >
              Search
            </button>
          </div>
          {searchMessage && (
            <p
              className={`mt-2 text-sm ${
                searchMessage === 'Match found'
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {searchMessage}
            </p>
          )}
        </Panel>

        <Panel position="top-right" className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md m-4">
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <p className="font-semibold mb-2">Legend:</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-purple-500 rounded"></div>
              <span>Object</span>
            </div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Array</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Primitive</span>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function JsonTreeVisualizer(props: JsonTreeVisualizerProps) {
  return (
    <ReactFlowProvider>
      <JsonTreeVisualizerContent {...props} />
    </ReactFlowProvider>
  );
}
