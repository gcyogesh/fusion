"use server";

export async function getEmptyItem<T>(): Promise<T> {
  return {
    id: Date.now().toString(),
    location: "",
    available: false,
    description: "",
  } as unknown as T;
}
