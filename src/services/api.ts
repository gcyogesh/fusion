export interface FetchAPIOptions {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
}

export async function fetchAPI<T = any>({
  endpoint,
  method = "GET",
  data,
  params,
  headers = {},
}: FetchAPIOptions): Promise<T> {
  // Construct URL with potential base path if your API is not at the root
  // const BASE_URL = process.env.NEXT_PUBLIC_API_URL || ''; // Example
  let url = `/api/${endpoint}`;

  if (params) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const res = await fetch(url, options);
    const text = await res.text(); // Read response as text first
    let json;
    try {
      json = JSON.parse(text); // Attempt to parse as JSON
    } catch (e) {
      // If parsing fails, the response was likely not JSON
      if (!res.ok) {
         // If response was not OK, throw error with the text
        throw new Error(`API Error: ${res.status} ${res.statusText} - ${text}`);
      } else {
        // If response was OK but not JSON, return the text
        return text as any; // Or handle non-JSON success based on expected types
      }
    }

    if (!res.ok) {
       // If response was not OK, throw error with the parsed JSON (if available)
      const errorMessage = json?.message || json?.error || text || 'Unknown API error';
      throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorMessage}`);
    }

    return json as T;

  } catch (error: any) {
    console.error("Fetch API Error:", error);
    throw new Error(`Network or API request failed: ${error.message}`);
  }
} 