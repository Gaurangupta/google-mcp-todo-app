import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Google Maps MCP Web App',
  description: 'A web application integrating with Google Maps via MCP server',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}