# Azure Deployment Guide

## Current Application Status

✅ **Local Development Ready**
- **Local URL:** http://localhost:3001
- **Network URL:** http://10.16.51.187:3001
- **Status:** Running successfully

## Prerequisites

1. **Azure Account**: You need an active Azure subscription
2. **GitHub Repository**: Your code should be in a GitHub repository
3. **Azure CLI** (optional): For command-line deployment

## Step-by-Step Deployment

### Option 1: Azure Portal (Recommended)

1. **Login to Azure Portal**:
   - Go to https://portal.azure.com
   - Sign in with your Azure account

2. **Create Static Web App**:
   - Click "Create a resource"
   - Search for "Static Web App"
   - Click "Create"

3. **Configure the Web App**:
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
   - **Name**: Choose a unique name (e.g., "google-mcp-todo-app")
   - **Plan Type**: Free (for development)
   - **Region**: Choose closest to your users

4. **GitHub Integration**:
   - **Source**: GitHub
   - **Organization**: Your GitHub username
   - **Repository**: Select your repository
   - **Branch**: main

5. **Build Configuration**:
   - **Build Presets**: Next.js
   - **App Location**: / (root)
   - **Api Location**: (leave empty)
   - **Output Location**: out

6. **Review and Create**:
   - Review all settings
   - Click "Create"
   - Wait for deployment (5-10 minutes)

### Option 2: Azure CLI

```bash
# Install Azure CLI (if not installed)
# macOS: brew install azure-cli
# Windows: Download from Azure website

# Login to Azure
az login

# Create resource group
az group create --name rg-google-mcp-app --location eastus

# Create static web app
az staticwebapp create \
    --name google-mcp-todo-app \
    --resource-group rg-google-mcp-app \
    --source https://github.com/YOUR_USERNAME/YOUR_REPO \
    --location eastus \
    --branch main \
    --app-location "/" \
    --output-location "out" \
    --login-with-github
```

## Post-Deployment Configuration

### 1. Verify Deployment

After deployment completes:
- Go to your Static Web App in Azure Portal
- Click on the URL to test your application
- Verify all features work correctly

### 2. Custom Domain (Optional)

To add a custom domain:
1. Go to your Static Web App in Azure Portal
2. Click "Custom domains" in the left menu
3. Click "Add" and follow the instructions
4. Configure DNS records with your domain provider

### 3. Environment Variables

If you need to add environment variables:
1. Go to "Configuration" in your Static Web App
2. Add application settings as needed
3. Restart the application

### 4. SSL Certificate

Azure automatically provides SSL certificates for:
- Default domain (your-app.azurestaticapps.net)
- Custom domains (once configured)

## Monitoring and Maintenance

### View Deployment History
- Go to "GitHub Actions" in your repository
- View build and deployment logs
- Monitor for any failures

### Application Insights (Optional)
```bash
# Add Application Insights for monitoring
az monitor app-insights component create \
    --app google-mcp-app-insights \
    --location eastus \
    --resource-group rg-google-mcp-app
```

### Update Application
- Push changes to your main branch
- GitHub Actions automatically rebuilds and deploys
- No manual intervention required

## Troubleshooting

### Common Issues

1. **Build Failures**:
   - Check GitHub Actions logs
   - Verify package.json dependencies
   - Ensure build output location is correct

2. **404 Errors**:
   - Verify staticwebapp.config.json is correctly configured
   - Check routing configuration

3. **API Errors**:
   - Verify MCP server endpoint is accessible
   - Check CORS configuration if needed

### Support Resources

- [Azure Static Web Apps Documentation](https://docs.microsoft.com/en-us/azure/static-web-apps/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)

## Cost Information

- **Free Tier**: 100 GB bandwidth, 0.5 GB storage
- **Standard Tier**: $9/month + usage
- **Custom domains**: Included
- **SSL certificates**: Included

## Security Best Practices

1. **Enable authentication** if handling sensitive data
2. **Configure API permissions** appropriately
3. **Use environment variables** for sensitive configuration
4. **Regular security updates** for dependencies

## Backup and Recovery

- Azure automatically backs up your deployment
- Your source code is backed up in GitHub
- Consider exporting configuration settings periodically