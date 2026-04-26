let accessToken: string | null = null;

export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

export const refreshAccessToken = async () => {
  try {
    const response = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Important: include credentials to send/receive cookies
      credentials: "include",
    });

    if (!response.ok) throw new Error("Refresh failed");

    const data = await response.json();
    setAccessToken(data.token);
    return data.token;
  } catch (error) {
    setAccessToken(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
    return null;
  }
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}, isRetry = false): Promise<any> => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const fullUrl = url.startsWith("/api") ? url : `/api${url}`;
  
  const response = await fetch(fullUrl, {
    ...options,
    headers,
    credentials: "include", // Send HttpOnly cookies
  });

  if (response.status === 401 && !isRetry && url !== "/api/auth/login") {
    // Attempt refresh
    const newToken = await refreshAccessToken();
    if (newToken) {
      return fetchWithAuth(url, options, true);
    }
  }

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
    const text = await response.text();
    data = { message: text.includes("Cannot POST") ? "Endpoint not found" : "Server error" };
  }

  if (!response.ok) {
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
