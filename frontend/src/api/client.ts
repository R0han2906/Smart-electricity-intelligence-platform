const API_URL = import.meta.env.VITE_API_URL || "https://electricity-intelligence-platform-backend.onrender.com";

export interface User {
  id: number;
  name: string;
  email: string;
  created_at?: string;
}

export interface ConsumptionHistoryRecord {
  month: string; // "YYYY-MM-DD"
  actual_kwh: number;
}

export interface PredictionRecord {
  month: string; // "YYYY-MM-DD"
  predicted_kwh: number;
  predicted_bill: number;
  carbon_kg: number;
}

export interface DashboardDataResponse {
  consumption_history: ConsumptionHistoryRecord[];
  predictions: PredictionRecord[];
}

export interface PredictionResult {
  predicted_kwh: number;
  predicted_bill: number;
  carbon_kg: number;
  trees_required: number;
  vehicle_km_equivalent: number;
  insights: string[];
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to fetch users");
  }
  return response.json();
}

export async function createUser(name: string, email: string): Promise<User> {
  const response = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Failed to create user profile");
  }
  return data;
}

export async function addConsumption(userId: number, month: string, actualKwh: number) {
  // Ensure month format is YYYY-MM-DD
  // Input: "YYYY-MM" from type="month"
  // Output: "YYYY-MM-01"
  let formattedMonth = month;
  if (month.length === 7) {
    formattedMonth = `${month}-01`;
  }
  const response = await fetch(`${API_URL}/consumption`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      month: formattedMonth,
      actual_kwh: actualKwh,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Failed to add consumption history");
  }
  return data;
}

export async function predictNextMonth(userId: number): Promise<PredictionResult> {
  const response = await fetch(`${API_URL}/predict-next-month`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: userId }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Failed to generate prediction");
  }
  return data;
}

export async function getDashboardData(userId: number): Promise<DashboardDataResponse> {
  const response = await fetch(`${API_URL}/dashboard?user_id=${userId}`, {
    method: "POST",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.detail || "Failed to fetch dashboard data");
  }
  return data;
}
