// Minimal persistence: Supabase REST if configured, otherwise structured logs
// (visible in Vercel runtime logs). Never store precise coordinates.

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const storeConfigured = Boolean(url && key);

export async function insertRow(table: string, row: Record<string, unknown>): Promise<boolean> {
  if (!url || !key) {
    console.log(JSON.stringify({ store: "log-only", table, row }));
    return true;
  }
  const res = await fetch(`${url}/rest/v1/${table}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (res.status === 409) return true; // duplicate signup: treat as success
  if (!res.ok) {
    console.error(JSON.stringify({ store: "supabase-error", table, status: res.status, body: await res.text() }));
  }
  return res.ok;
}
