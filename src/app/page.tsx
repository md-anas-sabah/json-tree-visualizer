'use client';

import { useState } from 'react';
import JsonInput from '@/components/JsonInput';
import JsonTreeVisualizer from '@/components/JsonTreeVisualizer';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [jsonData, setJsonData] = useState<any>(null);
  const [searchPath, setSearchPath] = useState('');
  const [resetKey, setResetKey] = useState(0);

  const handleClearAll = () => {
    setJsonData(null);
    setSearchPath('');
    setResetKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1"></div>
            <div className="text-center flex-1">
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
                JSON Tree Visualizer
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Visualize and search JSON data as an interactive tree
              </p>
            </div>
            <div className="flex-1 flex justify-end gap-2">
              <ThemeToggle />
              {jsonData && (
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                  title="Clear all and reset"
                >
                  Clear/Reset
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - JSON Input */}
          <div className="lg:col-span-1">
            <JsonInput key={resetKey} onJsonParsed={setJsonData} />
          </div>

          {/* Right Panel - Tree Visualization */}
          <div className="lg:col-span-2">
            {jsonData ? (
              <JsonTreeVisualizer
                jsonData={jsonData}
                searchPath={searchPath}
                onSearchPathChange={setSearchPath}
              />
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 h-[600px] flex items-center justify-center">
                <p className="text-gray-400 text-lg">
                  Enter valid JSON data to visualize the tree
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
