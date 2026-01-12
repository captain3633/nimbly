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
    console.log('Sending request with token:', token.substring(0, 20) + '...');
  } else {
    console.warn('No auth token found in localStorage');
  }

  console.log('API Request:', { url, headers: { ...headers, Authorization: headers.Authorization ? 'Bearer ***' : undefined } });

  const response = await fetch(url, {
    ...options,
    headers,
  });

  console.log('API Response:', { status: response.status, ok: response.ok });

  if (!response.ok) {
    let errorData: any = {};
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        errorData = await response.json();
      } catch (e) {
        // Silent fail on JSON parse error
      }
    }
    
    // Handle 401 specially
    if (response.status === 401) {
      throw new ApiError(
        'Missing authorization header',
        401,
        errorData
      );
    }
    
    // FastAPI returns errors in { detail: "message" } format
    const errorMessage = errorData.detail || errorData.message || `Request failed with status ${response.status}`;
    
    throw new ApiError(
      errorMessage,
      response.status,
      errorData
    );
  }

  return response.json();
}

// Auth API
export const authApi = {
  signUp: async (email: string, password: string) => {
    return fetchApi<{ user_id: string; email: string; session_token: string; auth_provider: string }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  signIn: async (email: string, password: string) => {
    return fetchApi<{ user_id: string; email: string; session_token: string; auth_provider: string }>(
      '/api/auth/signin',
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  },

  requestMagicLink: async (email: string) => {
    return fetchApi<{ message: string }>('/api/auth/request-magic-link', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  verifyMagicLink: async (token: string) => {
    return fetchApi<{ user_id: string; email: string; session_token: string }>(
      `/api/auth/verify?token=${token}`,
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

  list: async (offset = 0, limit = 20) => {
    const response = await fetchApi<{ receipts: any[]; total: number; limit: number; offset: number }>(
      `/api/receipts?offset=${offset}&limit=${limit}`
    );
    return response.receipts;
  },

  get: async (id: string) => {
    return fetchApi<any>(`/api/receipts/${id}`);
  },
};

// Insights API
export const insightsApi = {
  list: async () => {
    return fetchApi<InsightsResponse>('/api/insights');
  },
};

// Unified API export
export const api = {
  auth: authApi,
  receipts: receiptsApi,
  insights: insightsApi,
};

// TypeScript types
export interface ReceiptUploadResponse {
  receipt_id: string;
  status: string;
  message: string;
}

export interface Receipt {
  receipt_id: string;
  store_name: string | null;
  purchase_date: string | null;
  total_amount: number | null;
  parse_status: 'pending' | 'success' | 'failed' | 'needs_review';
  upload_timestamp: string;
}

export interface LineItem {
  id: string;
  product_name: string;
  quantity: number | null;
  unit_price: number | null;
  total_price: number;
}

export interface ReceiptDetail extends Receipt {
  line_items: LineItem[];
  parse_error: string | null;
}

export interface Insight {
  type: string;
  title: string;
  description: string;
  data_points: number;
  confidence: 'high' | 'medium' | 'low';
  underlying_data: InsightDataPoint[];
  generated_at: string;
}

export interface InsightDataPoint {
  date: string | null;
  price: number | null;
  receipt_id: string | null;
}

export interface InsightsResponse {
  insights: Insight[];
  message: string | null;
}
