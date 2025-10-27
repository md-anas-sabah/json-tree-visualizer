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
import domtoimage from 'dom-to-image';
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
  const { fitView, setCenter, getNodes } = useReactFlow();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);

  const downloadImage = useCallback(() => {
    const reactFlowWrapper = document.querySelector('.react-flow') as HTMLElement;

    if (!reactFlowWrapper) {
      console.error('React Flow wrapper not found');
      return;
    }

    // Hide controls and panels temporarily
    const controls = reactFlowWrapper.querySelector('.react-flow__controls') as HTMLElement;
    const panels = reactFlowWrapper.querySelectorAll('.react-flow__panel');

    if (controls) controls.style.display = 'none';
    panels.forEach((panel) => {
      (panel as HTMLElement).style.display = 'none';
    });

    // Capture the image
    domtoimage.toPng(reactFlowWrapper, {
      quality: 1,
      bgcolor: '#ffffff',
      width: reactFlowWrapper.offsetWidth,
      height: reactFlowWrapper.offsetHeight,
    })
      .then((dataUrl: string) => {
        // Restore controls and panels
        if (controls) controls.style.display = '';
        panels.forEach((panel) => {
          (panel as HTMLElement).style.display = '';
        });

        // Download the image
        const link = document.createElement('a');
        link.download = 'json-tree-visualization.png';
        link.href = dataUrl;
        link.click();
      })
      .catch((error: Error) => {
        console.error('Error generating image:', error);

        // Restore controls and panels even on error
        if (controls) controls.style.display = '';
        panels.forEach((panel) => {
          (panel as HTMLElement).style.display = '';
        });
      });
  }, []);

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
            <div className="flex items-center gap-2 mb-3">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Primitive</span>
            </div>
            <button
              onClick={downloadImage}
              className="w-full px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium
                       rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Image
            </button>
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
