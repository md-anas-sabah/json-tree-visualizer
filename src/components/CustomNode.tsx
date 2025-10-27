/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

interface CustomNodeData {
  label: string;
  type: 'object' | 'array' | 'primitive';
  value?: any;
  path: string;
  highlighted?: boolean;
}

interface CustomNodeProps {
  data: CustomNodeData;
}

function CustomNode({ data }: CustomNodeProps) {
  const getNodeStyle = () => {
    const baseStyle = 'px-4 py-2 rounded-lg shadow-md border-2 transition-all duration-200';

    let colorStyle = '';
    if (data.type === 'object') {
      colorStyle = 'bg-purple-50 border-purple-500 text-purple-900 dark:bg-purple-900/30 dark:text-purple-200';
    } else if (data.type === 'array') {
      colorStyle = 'bg-green-50 border-green-500 text-green-900 dark:bg-green-900/30 dark:text-green-200';
    } else {
      colorStyle = 'bg-orange-50 border-orange-500 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200';
    }

    const highlightStyle = data.highlighted
      ? 'ring-4 ring-yellow-400 ring-offset-2 scale-110'
      : '';

    return `${baseStyle} ${colorStyle} ${highlightStyle}`;
  };

  const formatValue = (value: any) => {
    if (typeof value === 'string') return `"${value}"`;
    if (value === null) return 'null';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    return JSON.stringify(value);
  };

  return (
    <div className={getNodeStyle()} title={data.path}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="font-mono text-sm">
        <div className="font-semibold">{data.label}</div>
        {data.type === 'primitive' && data.value !== undefined && (
          <div className="text-xs mt-1 opacity-80">
            {formatValue(data.value)}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(CustomNode);
