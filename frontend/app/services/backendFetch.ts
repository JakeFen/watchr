const BACKEND_URL = process.env.BACKEND_URL;

export function backendUrl(path: string): string {
  return `${BACKEND_URL}${path}`;
}

export function backendFetch(token: string, path: string, init?: RequestInit): Promise<Response> {
  return fetch(backendUrl(path), {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });
}
