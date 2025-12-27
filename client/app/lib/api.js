const API_BASE = "http://localhost:8080/api";

// Generic API call helper
async function apiCall(endpoint, options = {}) {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  // If body is an object, stringify it
  if (fetchOptions.body && typeof fetchOptions.body === "object") {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  const res = await fetch(`${API_BASE}${endpoint}`, fetchOptions);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

// Auth endpoints
export const loginRequest = (email, password) =>
  apiCall("/auth/login", {
    method: "POST",
    body: { email, password },
  });

export const registerRequest = (formData) =>
  apiCall("/auth/register", {
    method: "POST",
    body: formData,
  });

// Equipment endpoints
export const getEquipments = (query = {}) => {
  const filteredQuery = Object.fromEntries(
    Object.entries(query).filter(([_, value]) => value !== undefined && value !== null && value !== "")
  );
  const params = new URLSearchParams(filteredQuery).toString();
  return apiCall(`/equipments${params ? `?${params}` : ""}`);
};

export const getEquipment = (id) => apiCall(`/equipments/${id}`);
export const createEquipment = (data) =>
  apiCall("/equipments", {
    method: "POST",
    body: data,
  });
export const updateEquipment = (id, data) =>
  apiCall(`/equipments/${id}`, {
    method: "PUT",
    body: data,
  });
export const deleteEquipment = (id) =>
  apiCall(`/equipments/${id}`, {
    method: "DELETE",
  });
export const scrapEquipment = (id) =>
  apiCall(`/equipments/${id}/scrap`, {
    method: "PATCH",
  });

// Maintenance Request endpoints
export const getRequests = () => apiCall("/requests");
export const getRequest = (id) => apiCall(`/requests/${id}`);
export const createRequest = (data) =>
  apiCall("/requests", {
    method: "POST",
    body: data,
  });
export const updateRequest = (id, data) =>
  apiCall(`/requests/${id}`, {
    method: "PUT",
    body: data,
  });
export const deleteRequest = (id) =>
  apiCall(`/requests/${id}`, {
    method: "DELETE",
  });

// Maintenance Team endpoints
export const getTeams = () => apiCall("/maintenance-teams");
export const getTeam = (id) => apiCall(`/maintenance-teams/${id}`);
export const createTeam = (data) =>
  apiCall("/maintenance-teams", {
    method: "POST",
    body: data,
  });
export const deleteTeam = (id) =>
  apiCall(`/maintenance-teams/${id}`, {
    method: "DELETE",
  });

// Team Member endpoints
export const getTeamMembers = (teamId) =>
  apiCall(`/team-members/team/${teamId}`);
export const addTeamMember = (data) =>
  apiCall("/team-members", {
    method: "POST",
    body: data,
  });
export const removeTeamMember = (id) =>
  apiCall(`/team-members/${id}`, {
    method: "DELETE",
  });
