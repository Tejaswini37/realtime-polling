const API = process.env.REACT_APP_API_URL; 

export async function request(path, method = "GET", body = null) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const errorMessage = await res.text();
    throw new Error(errorMessage || "API error");
  }

  return res.json();
}
