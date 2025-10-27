/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

interface JsonInputProps {
  onJsonParsed: (data: any) => void;
}

const SAMPLE_JSON = {
  user: {
    id: 1,
    name: "Md Anas Sabah",
    email: "mdanassabah@gmail.com",
    address: {
      street: "Phulwari Sharif",
      city: "Patna",
      zipCode: "801505",
    },
    isActive: true,
  },
  experience: [
    {
      company: "Marqait",
      role: "Software Development Engineer",
      location: "Bangalore, India",
      duration: "May 2025 – Present",
    },
    {
      company: "GrowHut",
      role: "Software Development Engineer",
      location: "Gurgaon, India",
      duration: "Oct 2024 – May 2025",
    },
    {
      company: "AgentProd",
      role: "Software Development Engineer Intern",
      location: "Bangalore, India",
      duration: "Apr 2024 – Sept 2024",
    },
  ],
};

export default function JsonInput({ onJsonParsed }: JsonInputProps) {
  const [input, setInput] = useState(JSON.stringify(SAMPLE_JSON, null, 2));
  const [error, setError] = useState("");

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(input);
      setError("");
      onJsonParsed(parsed);
    } catch (e) {
      setError("Invalid JSON: " + (e as Error).message);
      onJsonParsed(null);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
        JSON Input
      </h2>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste or type JSON data here..."
        className="w-full h-[400px] p-4 border border-gray-300 dark:border-gray-600 rounded-lg
                   font-mono text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
        </div>
      )}

      <button
        onClick={handleVisualize}
        className="cursor-pointer mt-4 w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                   rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2
                   focus:ring-blue-500 focus:ring-offset-2"
      >
        Generate Tree
      </button>
    </div>
  );
}
