import { AUTH_URL } from "../constants/appConfig";

export const loginRequest = async (credentials) => {
  const response = await fetch(AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    throw new Error("Invalid username or password");
  }

  return response.json();
};
