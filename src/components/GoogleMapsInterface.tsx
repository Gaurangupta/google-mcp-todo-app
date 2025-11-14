'use client';

import { useState } from 'react';
import { GoogleMapsMCPClient } from '@/lib/mcp-client';
import { Search, MapPin, Navigation, Clock } from 'lucide-react';

interface Place {
  place_id: string;
  name: string;
  formatted_address: string;
  rating?: number;
  types: string[];
}

interface Direction {
  summary: string;
  legs: Array<{
    duration: { text: string };
    distance: { text: string };
    start_address: string;
    end_address: string;
  }>;
}

export default function GoogleMapsInterface() {
  const [mcpClient] = useState(() => new GoogleMapsMCPClient());
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [directions, setDirections] = useState<Direction | null>(null);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  const searchPlaces = async () => {
    if (!searchQuery.trim()) return;
    
    setLoading(true);
    try {
      const result = await mcpClient.searchPlaces(searchQuery);
      setPlaces(result.content || []);
    } catch (error) {
      console.error('Error searching places:', error);
      alert('Error searching places. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPlaceDetails = async (placeId: string) => {
    setLoading(true);
    try {
      const result = await mcpClient.getPlaceDetails(placeId);
      setSelectedPlace(result.content);
    } catch (error) {
      console.error('Error getting place details:', error);
      alert('Error getting place details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getDirections = async () => {
    if (!origin.trim() || !destination.trim()) return;
    
    setLoading(true);
    try {
      const result = await mcpClient.getDirections(origin, destination);
      setDirections(result.content);
    } catch (error) {
      console.error('Error getting directions:', error);
      alert('Error getting directions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Google Maps MCP Integration
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Places Search */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Search className="mr-2" />
              Search Places
            </h2>
            
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for places..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && searchPlaces()}
              />
              <button
                onClick={searchPlaces}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Search
              </button>
            </div>

            {places.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Search Results:</h3>
                {places.map((place) => (
                  <div
                    key={place.place_id}
                    className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => getPlaceDetails(place.place_id)}
                  >
                    <h4 className="font-semibold text-lg">{place.name}</h4>
                    <p className="text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {place.formatted_address}
                    </p>
                    {place.rating && (
                      <p className="text-yellow-600">Rating: {place.rating}/5</p>
                    )}
                    <div className="flex flex-wrap gap-1 mt-2">
                      {place.types.slice(0, 3).map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Directions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Navigation className="mr-2" />
              Get Directions
            </h2>
            
            <div className="space-y-4 mb-4">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="From (origin)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="To (destination)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={getDirections}
                disabled={loading}
                className="w-full px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                Get Directions
              </button>
            </div>

            {directions && (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Route Information:</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold">{directions.summary}</h4>
                  {directions.legs.map((leg, index) => (
                    <div key={index} className="mt-3">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{leg.duration.text}</span>
                        <span className="mx-2">•</span>
                        <span>{leg.distance.text}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        From: {leg.start_address}
                      </p>
                      <p className="text-sm text-gray-500">
                        To: {leg.end_address}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Selected Place Details */}
        {selectedPlace && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Place Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold">{selectedPlace.name}</h3>
                <p className="text-gray-600 flex items-center mt-2">
                  <MapPin className="w-4 h-4 mr-1" />
                  {selectedPlace.formatted_address}
                </p>
                {selectedPlace.rating && (
                  <p className="text-yellow-600 mt-2">
                    Rating: {selectedPlace.rating}/5
                  </p>
                )}
                {selectedPlace.formatted_phone_number && (
                  <p className="text-gray-700 mt-2">
                    Phone: {selectedPlace.formatted_phone_number}
                  </p>
                )}
                {selectedPlace.website && (
                  <p className="text-blue-600 mt-2">
                    <a href={selectedPlace.website} target="_blank" rel="noopener noreferrer">
                      Visit Website
                    </a>
                  </p>
                )}
              </div>
              <div>
                {selectedPlace.opening_hours && (
                  <div>
                    <h4 className="font-semibold">Opening Hours:</h4>
                    <ul className="text-sm text-gray-600 mt-1">
                      {selectedPlace.opening_hours.weekday_text.map((day: string, index: number) => (
                        <li key={index}>{day}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-8 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p>Loading...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}