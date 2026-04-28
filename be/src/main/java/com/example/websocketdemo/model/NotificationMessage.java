package com.example.websocketdemo.model;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public class NotificationMessage {

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "content is required")
    private String content;

    private LocalDateTime sentAt;

    public NotificationMessage() {
    }

    public NotificationMessage(String title, String content, LocalDateTime sentAt) {
        this.title = title;
        this.content = content;
        this.sentAt = sentAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getSentAt() {
        return sentAt;
    }

    public void setSentAt(LocalDateTime sentAt) {
        this.sentAt = sentAt;
    }
}
