export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (user && user.token) {
    headers["Authorization"] = `Bearer ${user.token}`;
  }

  const fullUrl = url.startsWith("/api") ? url : `/api${url}`;
  
  const response = await fetch(fullUrl, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  let data;
  if (isJson) {
    try {
      data = await response.json();
    } catch (e) {
      data = { message: "Invalid server response" };
    }
  } else {
    // If not JSON, it's likely an HTML error page or raw text
    const text = await response.text();
    data = { message: text.includes("Cannot POST") ? "Endpoint not found" : "Server error" };
  }

  if (!response.ok) {
    // Return a clean message, never raw HTML
    throw new Error(data.message || "An unexpected error occurred");
  }

  return data;
};

const api = {
  get: (url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: "GET" }),
  post: (url: string, data?: any, options?: RequestInit) => 
    fetchWithAuth(url, { ...options, method: "POST", body: JSON.stringify(data) }),
  put: (url: string, data?: any, options?: RequestInit) => 
    fetchWithAuth(url, { ...options, method: "PUT", body: JSON.stringify(data) }),
  patch: (url: string, data?: any, options?: RequestInit) => 
    fetchWithAuth(url, { ...options, method: "PATCH", body: JSON.stringify(data) }),
  delete: (url: string, options?: RequestInit) => fetchWithAuth(url, { ...options, method: "DELETE" }),
};

export default api;
