'use client';

import { useState } from 'react';
import { Map, CheckSquare } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-2xl font-bold text-gray-800">
            Google Maps MCP App
          </h1>
          
          <div className="flex space-x-4">
            <button
              onClick={() => onTabChange('maps')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'maps'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Map className="w-5 h-5 mr-2" />
              Maps Search
            </button>
            
            <button
              onClick={() => onTabChange('todos')}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'todos'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <CheckSquare className="w-5 h-5 mr-2" />
              Todo Manager
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}