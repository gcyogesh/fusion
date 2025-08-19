import Cookies from "js-cookie";
import { APIResponse } from "@/types";
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://newapi.fusionexpeditions.com";

interface FetchAPIOptions<T = unknown> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: T | FormData;
  id?: string | number;
  slug?: string;
  revalidateSeconds?: number;
}

// ✅ Strongly typed fetchAPI with generic return
export const fetchAPI = async <TResponse = any, TData = unknown>({
  endpoint = "",
  method = "GET",
  data,
  id,
  slug,
  revalidateSeconds = 10,
}: FetchAPIOptions<TData>): Promise<APIResponse<TResponse>> => {
  const token = Cookies.get("token");

  const urlParts: string[] = [API_BASE, endpoint];
  if (slug) urlParts.push(slug);
  else if (id !== undefined) urlParts.push(String(id));
  const url = urlParts.join("/");

  const headers: Record<string, string> = {};

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
      body: method !== "GET" && data
        ? (data instanceof FormData ? data : JSON.stringify(data))
        : undefined,
      next: { revalidate: revalidateSeconds },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let userMessage = "Something went wrong.";
      try {
        const json = JSON.parse(errorText);
        userMessage = json?.message || json?.error || errorText;
      } catch {
        const pre = errorText.match(/<pre>([\s\S]*?)<\/pre>/i);
        userMessage = pre?.[1]?.trim() || errorText.slice(0, 200).trim();
      }

      const validation = userMessage.match(/Validation failed: ([^:]+: Path `[^`]+` is required\.)/i);
      if (validation) {
        const cleanMsg = validation[1].replace(/: Path `([^`]+)` is required\./, ' is required.');
        userMessage = cleanMsg.charAt(0).toUpperCase() + cleanMsg.slice(1);
      }

      userMessage = userMessage.split('<br>')[0].trim();
      throw new Error(userMessage);
    }

    return response.json() as Promise<APIResponse<TResponse>>;
  } catch (error) {
    if (error instanceof Error) throw error;
    throw new Error(String(error));
  }
};

export type { APIResponse };
