// Get the API URL from environment variables, fallback to localhost for development
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function to construct API endpoints
export const getApiUrl = (path: string) => `${API_URL}${path}`;