'use client';

import { useState, useEffect } from 'react';
import { GoogleMapsMCPClient } from '@/lib/mcp-client';
import { Plus, Trash2, MapPin, CheckCircle, Circle, Clock } from 'lucide-react';

interface Todo {
  id: string;
  title: string;
  description: string;
  location?: {
    address: string;
    lat: number;
    lng: number;
  };
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
  dueDate?: Date;
}

export default function TodoManager() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState({
    title: '',
    description: '',
    location: '',
    priority: 'medium' as const,
    dueDate: ''
  });
  const [mcpClient] = useState(() => new GoogleMapsMCPClient());
  const [loading, setLoading] = useState(false);
  const [locationSuggestions, setLocationSuggestions] = useState<any[]>([]);

  useEffect(() => {
    // Load todos from localStorage
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      const parsed = JSON.parse(savedTodos);
      setTodos(parsed.map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined
      })));
    }
  }, []);

  useEffect(() => {
    // Save todos to localStorage
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const searchLocation = async (query: string) => {
    if (query.length < 3) {
      setLocationSuggestions([]);
      return;
    }

    try {
      const result = await mcpClient.searchPlaces(query);
      setLocationSuggestions(result.content?.slice(0, 5) || []);
    } catch (error) {
      console.error('Error searching location:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.title.trim()) return;

    setLoading(true);
    try {
      let location = undefined;
      
      if (newTodo.location.trim()) {
        const result = await mcpClient.searchPlaces(newTodo.location);
        if (result.content && result.content.length > 0) {
          const place = result.content[0];
          location = {
            address: place.formatted_address,
            lat: place.geometry?.location?.lat || 0,
            lng: place.geometry?.location?.lng || 0
          };
        }
      }

      const todo: Todo = {
        id: Date.now().toString(),
        title: newTodo.title,
        description: newTodo.description,
        location,
        completed: false,
        priority: newTodo.priority,
        createdAt: new Date(),
        dueDate: newTodo.dueDate ? new Date(newTodo.dueDate) : undefined
      };

      setTodos(prev => [...prev, todo]);
      setNewTodo({
        title: '',
        description: '',
        location: '',
        priority: 'medium',
        dueDate: ''
      });
      setLocationSuggestions([]);
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getDirectionsToTodo = async (todo: Todo) => {
    if (!todo.location) return;
    
    try {
      // Get user's location (simplified - in real app you'd get actual location)
      const userLocation = "Current Location";
      const result = await mcpClient.getDirections(userLocation, todo.location.address);
      
      // Open in new window or handle directions display
      alert(`Directions: ${JSON.stringify(result.content, null, 2)}`);
    } catch (error) {
      console.error('Error getting directions:', error);
    }
  };

  const completedTodos = todos.filter(todo => todo.completed);
  const pendingTodos = todos.filter(todo => !todo.completed);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Location-Based Todo Manager
        </h1>

        {/* Add New Todo */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4 flex items-center">
            <Plus className="mr-2" />
            Add New Todo
          </h2>
          
          <div className="space-y-4">
            <input
              type="text"
              value={newTodo.title}
              onChange={(e) => setNewTodo(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Todo title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            
            <textarea
              value={newTodo.description}
              onChange={(e) => setNewTodo(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Description (optional)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            
            <div className="relative">
              <input
                type="text"
                value={newTodo.location}
                onChange={(e) => {
                  setNewTodo(prev => ({ ...prev, location: e.target.value }));
                  searchLocation(e.target.value);
                }}
                placeholder="Location (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              {locationSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {locationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setNewTodo(prev => ({ ...prev, location: suggestion.formatted_address }));
                        setLocationSuggestions([]);
                      }}
                    >
                      <div className="font-medium">{suggestion.name}</div>
                      <div className="text-sm text-gray-600">{suggestion.formatted_address}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex space-x-4">
              <select
                value={newTodo.priority}
                onChange={(e) => setNewTodo(prev => ({ ...prev, priority: e.target.value as any }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              
              <input
                type="datetime-local"
                value={newTodo.dueDate}
                onChange={(e) => setNewTodo(prev => ({ ...prev, dueDate: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              
              <button
                onClick={addTodo}
                disabled={loading || !newTodo.title.trim()}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Add Todo
              </button>
            </div>
          </div>
        </div>

        {/* Todo Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pending Todos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Pending Todos ({pendingTodos.length})
            </h2>
            
            <div className="space-y-4">
              {pendingTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`border-l-4 rounded-lg p-4 ${getPriorityColor(todo.priority)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="text-gray-400 hover:text-green-500"
                        >
                          <Circle className="w-6 h-6" />
                        </button>
                        <h3 className="font-semibold">{todo.title}</h3>
                      </div>
                      
                      {todo.description && (
                        <p className="text-gray-600 mt-1 ml-8">{todo.description}</p>
                      )}
                      
                      {todo.location && (
                        <div className="flex items-center text-sm text-gray-500 mt-2 ml-8">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{todo.location.address}</span>
                          <button
                            onClick={() => getDirectionsToTodo(todo)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            Get Directions
                          </button>
                        </div>
                      )}
                      
                      {todo.dueDate && (
                        <div className="flex items-center text-sm text-gray-500 mt-1 ml-8">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Due: {todo.dueDate.toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Completed Todos */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Completed Todos ({completedTodos.length})
            </h2>
            
            <div className="space-y-4">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className="border rounded-lg p-4 bg-gray-50 opacity-75"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleTodo(todo.id)}
                          className="text-green-500 hover:text-gray-400"
                        >
                          <CheckCircle className="w-6 h-6" />
                        </button>
                        <h3 className="font-semibold line-through">{todo.title}</h3>
                      </div>
                      
                      {todo.description && (
                        <p className="text-gray-500 mt-1 ml-8 line-through">{todo.description}</p>
                      )}
                      
                      {todo.location && (
                        <div className="flex items-center text-sm text-gray-400 mt-2 ml-8">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{todo.location.address}</span>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p>Processing...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}