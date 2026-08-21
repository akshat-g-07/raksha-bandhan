import supabase from "./supabase";

const VISITOR_KEY = "rb_visitor";
const SESSION_KEY = "rb_session";

// crypto.randomUUID needs a secure context (https / localhost); fall back for
// http on a LAN IP so mobile testing doesn't throw.
function uuid() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Stable per-browser id for counting unique visitors (random, no PII).
function getVisitorId() {
  if (typeof window === "undefined") return null;
  let v = localStorage.getItem(VISITOR_KEY);
  if (!v) {
    v = uuid();
    localStorage.setItem(VISITOR_KEY, v);
  }
  return v;
}

export function getSessionId() {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY);
}

export async function startSession() {
  if (!supabase) return null;
  const existing = getSessionId();
  if (existing) return existing;
  const { data, error } = await supabase.rpc("start_session", {
    p_visitor: getVisitorId(),
  });
  if (error || !data) return null;
  sessionStorage.setItem(SESSION_KEY, data);
  return data;
}

export async function heartbeat() {
  const sid = getSessionId();
  if (!supabase || !sid) return;
  await supabase.rpc("heartbeat", { p_session: sid });
}

export async function recordPlay(trackId) {
  const sid = getSessionId();
  if (!supabase || !sid || !trackId) return;
  await supabase.rpc("record_play", { p_session: sid, p_track: trackId });
}
