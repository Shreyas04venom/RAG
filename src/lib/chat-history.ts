import type { QueryResponse } from "./rag.types";

export type SessionHistoryItem = {
  id: string;
  timestamp: number;
  query: string;
  inputMode: "voice" | "text";
  response: QueryResponse;
};

const STORAGE_KEY = "edith_session_chat_history";
export const HISTORY_EVENT_NAME = "edith-history-update";

/**
 * Retrieves the full list of chat histories stored in the current browser tab session.
 * This storage is automatically cleared when the tab or window is closed.
 */
export function getSessionHistory(): SessionHistoryItem[] {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return [];
  }
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.warn("Failed to read session chat history:", err);
    return [];
  }
}

/**
 * Saves a new RAG query and exact response object to the tab session storage.
 */
export function saveSessionHistoryItem(
  query: string,
  response: QueryResponse,
  inputMode: "voice" | "text" = "text",
): SessionHistoryItem | null {
  if (typeof window === "undefined" || !window.sessionStorage) {
    return null;
  }
  try {
    const current = getSessionHistory();
    const newItem: SessionHistoryItem = {
      id: response.traceId || `hist_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      timestamp: Date.now(),
      query: query.trim() || response.query,
      inputMode,
      response,
    };

    // Filter out duplicates with the exact same trace ID if re-submitted
    const updated = [newItem, ...current.filter((item) => item.id !== newItem.id)];

    // Cap at 50 recent queries per tab session
    const capped = updated.slice(0, 50);

    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(capped));
    window.dispatchEvent(new CustomEvent(HISTORY_EVENT_NAME, { detail: capped }));
    return newItem;
  } catch (err) {
    console.warn("Failed to save session chat history:", err);
    return null;
  }
}

/**
 * Removes a single history item by id.
 */
export function deleteSessionHistoryItem(id: string): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    const current = getSessionHistory();
    const updated = current.filter((item) => item.id !== id);
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(HISTORY_EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.warn("Failed to delete session history item:", err);
  }
}

/**
 * Clears all chat history for the current session.
 */
export function clearSessionHistory(): void {
  if (typeof window === "undefined" || !window.sessionStorage) return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent(HISTORY_EVENT_NAME, { detail: [] }));
  } catch (err) {
    console.warn("Failed to clear session history:", err);
  }
}
