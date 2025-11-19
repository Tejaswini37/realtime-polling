const API = process.env.REACT_APP_API_URL;

export async function request(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error("API error");
  return res.json();
}
