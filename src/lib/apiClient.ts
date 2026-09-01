// Default same-origin (Vite dev proxy /api → API). Override via VITE_API_URL
// jika frontend dipisah dari API (mis. production).
const BASE_URL = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  public readonly status: number;
  public readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let body: { error?: { code?: string; message?: string } } | null = null;
    try {
      body = (await res.json()) as { error?: { code?: string; message?: string } };
    } catch {
      // ignore parse error
    }
    throw new ApiError(
      res.status,
      body?.error?.code ?? "API_ERROR",
      body?.error?.message ?? `HTTP ${res.status}`,
    );
  }
  return (await res.json()) as T;
}

export const apiClient = {
  get<T>(path: string): Promise<T> {
    return fetch(`${BASE_URL}/api${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
    }).then(handleResponse<T>);
  },

  post<T>(path: string, body: unknown): Promise<T> {
    return fetch(`${BASE_URL}/api${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    }).then(handleResponse<T>);
  },
};