const API_URL = import.meta.env.VITE_API_URL;

export async function getUserLists(token) {
  const res = await fetch(`${API_URL}/api/user/lists`, {
    headers: { Authorization: `Bearer ${token}` },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch user lists");
  return await res.json();
}

export async function removeFromList(token, movieId, listType) {
  const res = await fetch(`${API_URL}/api/user/${listType}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ movieId, action: "remove" }),
  });
  if (!res.ok) throw new Error("Failed to remove from list");
  return await res.json();
}

export async function addToList(token, movieId, listType) {
  const res = await fetch(`${API_URL}/api/user/${listType}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ movieId, action: "add" }),
  });
  if (!res.ok) throw new Error("Failed to add to list");
  return await res.json();
}
