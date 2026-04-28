export const withAccessToken = (url, token) => {
  const divider = url.includes("?") ? "&" : "?";
  return `${url}${divider}access_token=${encodeURIComponent(token)}`;
};

export const toInfoUrl = (baseUrl, token) =>
  `${baseUrl}/info?access_token=${encodeURIComponent(token)}&t=${Date.now()}`;

export const formatTime = (value) =>
  new Date(value || Date.now()).toLocaleString("en-GB", {
    hour12: false,
  });

export const parseStompBody = (rawBody) => {
  try {
    return JSON.parse(rawBody);
  } catch {
    return { content: String(rawBody) };
  }
};

export const buildNotification = (payload) => ({
  id: `${payload.sentAt || Date.now()}-${Math.random().toString(16).slice(2)}`,
  title: payload.title || "Breaking update",
  content: payload.content || "New story available in your feed.",
  sentAt: payload.sentAt || new Date().toISOString(),
});
