
/**
 * API Client for database operations
 * This will be used to make calls to your backend API or directly to a database
 * through services like Firebase, Supabase, or your own custom API
 */

// Base configuration for the API client
const API_BASE_URL = process.env.VITE_API_BASE_URL || '/api';

// Error handling
class ApiError extends Error {
  status: number;
  data: any;
  
  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// Basic fetch wrapper with error handling
async function fetchWithErrorHandling(url: string, options: RequestInit = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    // Parse the JSON response
    const data = await response.json();

    // Handle error responses
    if (!response.ok) {
      throw new ApiError(
        data.message || 'An error occurred during the API request',
        response.status,
        data
      );
    }

    return data;
  } catch (error) {
    // Re-throw fetch errors or our ApiError
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError(
        error instanceof Error ? error.message : 'Network error',
        0
      );
    }
  }
}

// API client methods
export const apiClient = {
  // GET request
  async get(endpoint: string, queryParams?: Record<string, string>) {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    
    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    return fetchWithErrorHandling(url.toString());
  },

  // POST request
  async post(endpoint: string, data: any) {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // PUT request
  async put(endpoint: string, data: any) {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // PATCH request
  async patch(endpoint: string, data: any) {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  // DELETE request
  async delete(endpoint: string) {
    return fetchWithErrorHandling(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
    });
  },
};

export default apiClient;
