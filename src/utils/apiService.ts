import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://yogeshbhai.ddns.net/api";

// Generic API response type
export interface APIResponse<T> {
  data: T;
  [key: string]: unknown;
}

interface FetchAPIOptions<T = unknown> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: T | FormData;
  id?: string | number;
  slug?: string;
}

export const fetchAPI = async <T = unknown>({
  endpoint = "",
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

  try {
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
      // Try to extract a user-friendly error message
      let userMessage = "Something went wrong while communicating with the server. Please try again later.";
      try {
        // Try to parse as JSON
        const json = JSON.parse(errorText);
        if (json && json.message) {
          userMessage = json.message;
        } else if (json && json.error) {
          userMessage = json.error;
        }
      } catch {
        // Not JSON, try to extract <pre>...</pre> from HTML
        const preMatch = errorText.match(/<pre>([\s\S]*?)<\/pre>/i);
        if (preMatch && preMatch[1]) {
          userMessage = preMatch[1].trim();
        } else if (errorText.length < 200) {
          userMessage = errorText.trim();
        }
      }
      throw new Error(userMessage);
    }

    return response.json();
  } catch (error) {
    // Global error handler
    console.error('Global API error:', error);
    throw new Error("A network or server error occurred. Please check your connection or try again later.");
  }
};