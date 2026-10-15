package com.soluper.backend.dto;

public class ChatMessageResponse {
    private String reply;
    private String sender = "DevBot AI";
    private long timestamp = System.currentTimeMillis();

    public ChatMessageResponse() {}

    public ChatMessageResponse(String reply) {
        this.reply = reply;
    }

    public String getReply() { return reply; }
    public void setReply(String reply) { this.reply = reply; }

    public String getSender() { return sender; }
    public void setSender(String sender) { this.sender = sender; }

    public long getTimestamp() { return timestamp; }
    public void setTimestamp(long timestamp) { this.timestamp = timestamp; }
}
