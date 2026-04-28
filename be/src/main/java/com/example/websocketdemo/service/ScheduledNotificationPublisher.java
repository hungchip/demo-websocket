package com.example.websocketdemo.service;

import com.example.websocketdemo.model.NotificationMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class ScheduledNotificationPublisher {

    private static final Logger log = LoggerFactory.getLogger(ScheduledNotificationPublisher.class);
    private static final List<String> TITLES = List.of(
            "Breaking News Alert",
            "Market Pulse Update",
            "Tech Flash",
            "World Watch",
            "Daily Insight"
    );
    private static final List<String> CONTENTS = List.of(
            "A new headline just arrived from the live feed.",
            "Fresh update detected in the latest market movements.",
            "A trending technology story is now available.",
            "International developments have just been updated.",
            "New editorial highlights are ready for review."
    );
    private final SimpMessagingTemplate messagingTemplate;
    private final AtomicLong sequence = new AtomicLong(0);

    public ScheduledNotificationPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    @Scheduled(fixedRate = 15000)
    public void publishRandomNotificationEvery15Seconds() {
        long current = sequence.incrementAndGet();
        int titleIndex = ThreadLocalRandom.current().nextInt(TITLES.size());
        int contentIndex = ThreadLocalRandom.current().nextInt(CONTENTS.size());
        NotificationMessage payload = new NotificationMessage(
                TITLES.get(titleIndex) + " #" + current,
                CONTENTS.get(contentIndex),
                LocalDateTime.now()
        );
        messagingTemplate.convertAndSend("/topic/notifications", payload);
        log.info("Scheduled random notification sent to /topic/notifications: {}", payload.getTitle());
    }
}
