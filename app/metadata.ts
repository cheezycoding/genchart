const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "GenChart - AI Flowchart Generator",
  description: "Generate flowcharts through natural conversations with AI",
}; 