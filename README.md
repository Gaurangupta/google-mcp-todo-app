# Google Maps MCP Web Application

A modern Next.js web application that integrates with Google Maps through the Model Context Protocol (MCP) server. This application provides location-based todo management and Google Maps search functionality.

## Features

- 🗺️ **Google Maps Integration**: Search places, get directions, and view place details
- ✅ **Location-Based Todo Management**: Create todos with location attachments
- 🚀 **Azure Cloud Deployment**: Ready for deployment to Azure Static Web Apps
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Built with Tailwind CSS and Lucide React icons

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **MCP Integration**: Google Maps MCP Server via Streamable HTTP
- **Deployment**: Azure Static Web Apps

## Google Maps MCP Integration

This application connects to the Google Maps MCP server using the hosted Streamable HTTP endpoint:

```json
{
  "mcpServers": {
    "google-maps": {
      "transport": "streamableHttp",
      "url": "https://mcp.open-mcp.org/api/server/google-maps@latest/mcp"
    }
  }
}
```

## Available Features

### Maps Interface
- Search for places and locations
- Get detailed place information
- Calculate directions between locations
- View place ratings and contact information

### Todo Manager
- Create location-based todos
- Set priority levels (high, medium, low)
- Add due dates and descriptions
- Get directions to todo locations
- Mark todos as complete
- Persistent storage using localStorage

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd "todo on maps"
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## Azure Deployment

This application is configured for deployment to Azure Static Web Apps.

### Prerequisites

- Azure account
- GitHub repository

### Deployment Steps

1. **Create Azure Static Web App**:
   - Go to Azure Portal
   - Create a new Static Web App resource
   - Connect to your GitHub repository
   - Select build preset: "Next.js"
   - Set build location to "/"
   - Set output location to "out"

2. **Configure GitHub Secrets**:
   - Add `AZURE_STATIC_WEB_APPS_API_TOKEN` to your repository secrets

3. **Deploy**:
   - Push to main branch
   - GitHub Actions will automatically build and deploy

### Configuration Files

- `staticwebapp.config.json`: Azure Static Web Apps configuration
- `.github/workflows/azure-static-web-apps.yml`: CI/CD pipeline
- `next.config.js`: Next.js configuration for static export

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── todo/
│   │   └── TodoManager.tsx  # Todo management interface
│   ├── GoogleMapsInterface.tsx # Maps search interface
│   └── Navigation.tsx       # Navigation component
└── lib/
    └── mcp-client.ts        # MCP client implementation
```

## API Usage

### Google Maps MCP Client

The application includes a TypeScript client for the Google Maps MCP server:

```typescript
const mcpClient = new GoogleMapsMCPClient();

// Search for places
const places = await mcpClient.searchPlaces("restaurants near me");

// Get place details
const details = await mcpClient.getPlaceDetails(placeId);

// Get directions
const directions = await mcpClient.getDirections("origin", "destination");
```

## Environment Variables

The application uses the following environment variables:

- `GOOGLE_MAPS_MCP_URL`: URL for the Google Maps MCP server (configured in next.config.js)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
1. Check the [Issues](../../issues) section
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## Roadmap

- [ ] Add map visualization component
- [ ] Implement user authentication
- [ ] Add real-time location tracking
- [ ] Integrate with calendar APIs
- [ ] Add offline functionality
- [ ] Implement push notifications

## Deployment Status

- ✅ Project Setup Complete
- ✅ MCP Integration Implemented
- ✅ UI Components Created
- ✅ Azure Configuration Ready
- ⏳ Awaiting Azure Deployment