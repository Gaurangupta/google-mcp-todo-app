// Google Maps MCP Client Configuration
export const mcpConfig = {
  mcpServers: {
    "google-maps": {
      transport: "streamableHttp",
      url: "https://mcp.open-mcp.org/api/server/google-maps@latest/mcp"
    }
  }
};

// MCP Client for Google Maps
export class GoogleMapsMCPClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = mcpConfig.mcpServers["google-maps"].url;
  }

  async callTool(toolName: string, arguments_: Record<string, any>) {
    try {
      const response = await fetch(`${this.baseUrl}/tools/call`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: toolName,
          arguments: arguments_
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error calling MCP tool:', error);
      throw error;
    }
  }

  async listTools() {
    try {
      const response = await fetch(`${this.baseUrl}/tools/list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error listing MCP tools:', error);
      throw error;
    }
  }

  // Google Maps specific methods
  async searchPlaces(query: string, location?: { lat: number; lng: number }) {
    return this.callTool('search_places', { query, location });
  }

  async getPlaceDetails(placeId: string) {
    return this.callTool('get_place_details', { place_id: placeId });
  }

  async getDirections(origin: string, destination: string, mode?: string) {
    return this.callTool('get_directions', { origin, destination, mode: mode || 'driving' });
  }

  async getNearbyPlaces(location: { lat: number; lng: number }, radius: number, type?: string) {
    return this.callTool('nearby_search', { location, radius, type });
  }
}