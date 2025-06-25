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
  revalidateSeconds?: number; // For ISR support
}

export const fetchAPI = async <T = unknown>({
  endpoint = "",
  method = "GET",
  data,
  id,
  slug,
  revalidateSeconds = 10, // ISR: revalidate after 60 seconds
}: FetchAPIOptions): Promise<T> => {
  const token = Cookies.get("token");

  const urlParts = [API_BASE, endpoint];
  if (slug) urlParts.push(slug);
  else if (id !== undefined) urlParts.push(String(id));
  const url = urlParts.join("/");

  const headers: Record<string, string> = {};

  // Only set JSON content type if not sending FormData
  if (data && !(data instanceof FormData)) {
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
      next: {
        revalidate: revalidateSeconds, // ✅ Enable ISR
      },
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Response error text:', errorText);
      let userMessage = "Something went wrong while communicating with the server.";
      try {
        const json = JSON.parse(errorText);
        if (json?.message) userMessage = json.message;
        else if (json?.error) userMessage = json.error;
        else if (typeof json === 'string') userMessage = json;
      } catch {
        const preMatch = errorText.match(/<pre>([\s\S]*?)<\/pre>/i);
        if (preMatch?.[1]) userMessage = preMatch[1].trim();
        else if (errorText.length < 200) userMessage = errorText.trim();
        else userMessage = errorText;
      }
      // Extract user-friendly validation error if present
      const validationMatch = userMessage.match(/Validation failed: ([^:]+: Path `[^`]+` is required\.)/i);
      if (validationMatch) {
        // e.g., 'tag: Path `tag` is required.' => 'tag is required.'
        const fieldMsg = validationMatch[1].replace(/: Path `([^`]+)` is required\./, ' is required.');
        userMessage = fieldMsg.charAt(0).toUpperCase() + fieldMsg.slice(1);
      }
      // Remove stack traces and technical details
      userMessage = userMessage.split('<br>')[0].trim();
      throw new Error(userMessage);
    }

    return response.json();
  } catch (error) {
    // Only throw the original error message, don't override with a generic one
    if (error instanceof Error) throw error;
    throw new Error(String(error));
  }
};
