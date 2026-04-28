# WebSocket Notification Demo

Demo thong bao realtime:
- `be`: Java Spring Boot (STOMP over SockJS)
- `fe`: ReactJS + `@stomp/stompjs` + `sockjs-client`

## 1) Chay backend

```bash
cd be
mvn spring-boot:run
```

Backend mac dinh o `http://localhost:8080`:
- STOMP endpoint: `http://localhost:8080/websocket/tracker`
- Topic subscribe: `/topic/notifications`
- Login JWT: `POST /api/auth/login`
- REST gui thong bao: `POST /api/notifications`
- WebSocket handshake yeu cau auth qua `access_token` query param

Body mau:
```json
{
  "title": "Thong bao moi",
  "content": "Xin chao tu backend"
}
```

## 2) Chay frontend

```bash
cd fe
npm install
npm run dev
```

Frontend chay o `http://localhost:5173`.

## 3) Test nhanh

1. Mo 2 tab trinh duyet cung vao frontend.
2. Gui thong bao tu form.
3. Ca 2 tab deu nhan message realtime qua WebSocket.

## 4) Tai khoan demo

- username: `admin`
- password: `123456`
