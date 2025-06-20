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

  console.log('🌐 API Call Details:');
  console.log('URL:', url);
  console.log('Method:', method);
  console.log('Data type:', data instanceof FormData ? 'FormData' : 'JSON');
  console.log('Has token:', !!token);

  const headers: Record<string, string> = {};

  // Only set JSON content type if not sending FormData
  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  console.log('Headers:', headers);

  const response = await fetch(url, {
    method,
    headers,
    body: method !== "GET" && data ? (data instanceof FormData ? data : JSON.stringify(data)) : undefined,
    cache: "no-store",
  });

  console.log('Response status:', response.status);
  console.log('Response ok:', response.ok);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Response error text:', errorText);
    throw new Error(`API error: ${response.status} - ${response.statusText} - ${errorText}`);
  }

  return response.json();
};