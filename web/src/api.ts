import { API_BASE } from "./API_BASE";

export async function getStatus() {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export default API_BASE;
