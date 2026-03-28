import type { ApiResponse } from '@/types';

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:8080/api/v1';

const TOKEN_KEY = 'serene_auth_token';

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: ApiResponse<unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & {
    params?: Record<string, string | number | boolean | undefined | null>;
    skipAuth?: boolean;
  } = {}
): Promise<ApiResponse<T>> {
  const { params, skipAuth, ...init } = options;
  let url = `${API_BASE}${path.startsWith('/') ? path : `/${path}`}`;
  if (params) {
    const sp = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') {
        sp.set(k, String(v));
      }
    }
    const q = sp.toString();
    if (q) url += `?${q}`;
  }

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.body != null && typeof init.body === 'string' && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (!skipAuth) {
    const token = getStoredToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...init, headers });

  let json: ApiResponse<T>;
  const text = await res.text();
  try {
    json = text ? (JSON.parse(text) as ApiResponse<T>) : { success: false, message: `HTTP ${res.status}` };
  } catch {
    json = { success: false, message: text || `HTTP ${res.status}` };
  }

  if (!res.ok) {
    return {
      success: false,
      message: json.message || `Request failed (${res.status})`,
      errors: json.errors,
    };
  }

  return json;
}