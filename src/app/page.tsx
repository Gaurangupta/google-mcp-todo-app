'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import GoogleMapsInterface from '@/components/GoogleMapsInterface';
import TodoManager from '@/components/todo/TodoManager';

export default function Home() {
  const [activeTab, setActiveTab] = useState('maps');

  return (
    <main className="min-h-screen bg-gray-50">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="pt-4">
        {activeTab === 'maps' && <GoogleMapsInterface />}
        {activeTab === 'todos' && <TodoManager />}
      </div>
    </main>
  );
}