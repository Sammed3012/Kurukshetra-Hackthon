package com.soluper.backend.dto;

public class ChatMessageRequest {
    private String message;
    private String theme;

    public ChatMessageRequest() {}

    public ChatMessageRequest(String message, String theme) {
        this.message = message;
        this.theme = theme;
    }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }
}
