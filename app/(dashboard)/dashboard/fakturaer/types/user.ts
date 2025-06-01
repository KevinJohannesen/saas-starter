export interface User {
  id: string;
  email: string;
  name: string;
  password: string; // In a real app, you would never store plain text passwords
  role: "admin" | "user";
  createdAt: string;
}

export interface Session {
  userId: string;
  expiresAt: number;
}
