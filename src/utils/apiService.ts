import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://yogeshbhai.ddns.net/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface FetchAPIOptions<T = any> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: T | FormData;
  id?: string | number;
  slug?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchAPI = async <T = any>({
  endpoint="",
  method = "GET",
  data,
  id,
  slug,
}: FetchAPIOptions): Promise<T> => {
  const token = Cookies.get("token");

  const urlParts = [API_BASE, endpoint];
  if (slug) urlParts.push(slug);
  else if (id !== undefined) urlParts.push(String(id));
  const url = urlParts.join("/");

  const headers: Record<string, string> = {};

  // Only set JSON content type if not sending FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    headers,
    body: method !== "GET" && data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${response.statusText}`);
  }

  return response.json();
};