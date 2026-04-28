import { API_URL } from "../constants/appConfig";

export const publishNotification = async (token, values) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    throw new Error("Failed to publish notification");
  }
};
