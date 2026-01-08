/**
 * API client for Nimbly backend
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge with provided headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new ApiError(
      errorData.detail || 'An error occurred',
      response.status,
      errorData
    );
  }

  return response.json();
}

// Auth API
export const authApi = {
  requestMagicLink: async (email: string) => {
    return fetchApi<{ message: string }>('/api/auth/request-magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyMagicLink: async (token: string) => {
    return fetchApi<{ access_token: string; token_type: string }>(
      `/api/auth/verify-magic-link?token=${token}`,
      { method: 'GET' }
    );
  },
};

// Receipts API
export const receiptsApi = {
  upload: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('auth_token');
    const response = await fetch(`${API_URL}/api/receipts/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || 'Upload failed',
        response.status,
        errorData
      );
    }

    return response.json();
  },

  list: async (skip = 0, limit = 20) => {
    return fetchApi<any[]>(`/api/receipts?skip=${skip}&limit=${limit}`);
  },

  get: async (id: string) => {
    return fetchApi<any>(`/api/receipts/${id}`);
  },
};

// Insights API
export const insightsApi = {
  list: async () => {
    return fetchApi<any[]>('/api/insights');
  },
};
