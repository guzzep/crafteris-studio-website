// Customer-facing destinations are enabled explicitly per deployment.
// Never configure these with staff tools, API endpoints or test harnesses.
export function customerDestination(key: string): URL | null {
  const value = process.env[key]?.trim();
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url;
  } catch { return null; }
}
