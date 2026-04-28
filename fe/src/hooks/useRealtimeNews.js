import { useCallback, useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client/dist/sockjs";
import { RANDOM_TOPICS, WS_URL_CANDIDATES } from "../constants/appConfig";
import {
  buildNotification,
  parseStompBody,
  toInfoUrl,
  withAccessToken,
} from "../utils/notificationUtils";

const MAX_NOTIFICATIONS = 30;

export const useRealtimeNews = (token, onRealtimeError) => {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [wsUrlInUse, setWsUrlInUse] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [latestRandom, setLatestRandom] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!token) {
      setConnected(false);
      setWsUrlInUse("");
      setNotifications([]);
      setLatestRandom(null);
      setUnreadCount(0);
      return undefined;
    }

    let cancelled = false;

    const connect = async () => {
      let selectedUrl = WS_URL_CANDIDATES[WS_URL_CANDIDATES.length - 1];
      for (const candidate of WS_URL_CANDIDATES) {
        try {
          const res = await fetch(toInfoUrl(candidate, token));
          if (res.ok) {
            selectedUrl = candidate;
            break;
          }
        } catch {
          // Keep trying next endpoint candidate.
        }
      }

      if (cancelled) {
        return;
      }

      setWsUrlInUse(selectedUrl);
      const client = new Client({
        webSocketFactory: () => new SockJS(withAccessToken(selectedUrl, token)),
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 3000,
        onConnect: () => {
          setConnected(true);
          onRealtimeError?.("");

          client.subscribe("/topic/notifications", (message) => {

            const body = parseStompBody(message.body);
            console.log('message', message, body);
            const normalized = buildNotification(body);
            setNotifications((prev) => [normalized, ...prev].slice(0, MAX_NOTIFICATIONS));
            setUnreadCount((prev) => prev + 1);
          });

          RANDOM_TOPICS.forEach((topic) => {
            client.subscribe(topic, (message) => {
              const body = parseStompBody(message.body);
              if (typeof body?.value === "number") {
                setLatestRandom(body.value);
              }
            });
          });
        },
        onStompError: (frame) => {
          const details =
            frame.body?.trim() || frame.headers.message || "STOMP error";
          onRealtimeError?.(details);
        },
        onWebSocketClose: () => {
          setConnected(false);
        },
      });

      client.activate();
      clientRef.current = client;
    };

    connect();

    return () => {
      cancelled = true;
      if (clientRef.current) {
        clientRef.current.deactivate();
        clientRef.current = null;
      }
    };
  }, [token, onRealtimeError]);

  const clearUnread = useCallback(() => setUnreadCount(0), []);

  const resetFeed = useCallback(() => {
    setNotifications([]);
    setLatestRandom(null);
    setUnreadCount(0);
  }, []);

  const addLocalNotification = useCallback((payload) => {
    const simulated = buildNotification(payload);
    setNotifications((prev) => [simulated, ...prev].slice(0, MAX_NOTIFICATIONS));
    setUnreadCount((prev) => prev + 1);
  }, []);

  const disconnect = useCallback(async () => {
    if (clientRef.current) {
      await clientRef.current.deactivate();
      clientRef.current = null;
    }
    setConnected(false);
  }, []);

  return {
    connected,
    wsUrlInUse,
    notifications,
    latestRandom,
    unreadCount,
    clearUnread,
    resetFeed,
    addLocalNotification,
    disconnect,
  };
};
