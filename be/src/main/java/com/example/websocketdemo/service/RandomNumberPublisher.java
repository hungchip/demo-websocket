package com.example.websocketdemo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
public class RandomNumberPublisher {

    private static final Logger log = LoggerFactory.getLogger(RandomNumberPublisher.class);
    private final SimpMessagingTemplate messagingTemplate;

    public RandomNumberPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Scheduled(fixedRate = 1000)
    public void publishRandomNumber() {
        int randomValue = ThreadLocalRandom.current().nextInt(1, 1001);
        Map<String, Object> payload = Map.of(
                "value", randomValue,
                "sentAt", LocalDateTime.now().toString()
        );
        messagingTemplate.convertAndSend("/topic/tracker", payload);
        log.info("Broadcast random number to /topic/tracker: {}", randomValue);
    }
}
