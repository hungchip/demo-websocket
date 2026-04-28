package com.example.websocketdemo.controller;

import com.example.websocketdemo.model.NotificationMessage;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private static final Logger log = LoggerFactory.getLogger(NotificationController.class);
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of(
                "status", "ok",
                "randomTopic", "/topic/tracker"
        );
    }

    @PostMapping
    public Map<String, String> sendNotification(@Valid @RequestBody NotificationMessage message) {
        NotificationMessage payload = new NotificationMessage(
                message.getTitle(),
                message.getContent(),
                LocalDateTime.now()
        );
        messagingTemplate.convertAndSend("/topic/notifications", payload);
        return Map.of("status", "sent");
    }

    @MessageMapping("/notify")
    public void notifyFromStomp(NotificationMessage message) {
        NotificationMessage payload = new NotificationMessage(
                message.getTitle(),
                message.getContent(),
                LocalDateTime.now()
        );
        messagingTemplate.convertAndSend("/topic/notifications", payload);
    }

    @PostMapping("/random/trigger")
    public Map<String, Object> triggerRandomOnce() {
        int value = ThreadLocalRandom.current().nextInt(1, 1001);
        Map<String, Object> payload = Map.of(
                "value", value,
                "sentAt", LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/tracker", payload);
        log.info("Manual random trigger sent: {}", payload);
        return payload;
    }
}
