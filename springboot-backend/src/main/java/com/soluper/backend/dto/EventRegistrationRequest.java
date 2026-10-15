package com.soluper.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EventRegistrationRequest {

    @NotBlank(message = "Participant name is required")
    private String participantName;

    @NotBlank(message = "Participant email is required")
    @Email(message = "Invalid email format")
    private String participantEmail;

    public EventRegistrationRequest() {}

    public EventRegistrationRequest(String participantName, String participantEmail) {
        this.participantName = participantName;
        this.participantEmail = participantEmail;
    }

    public String getParticipantName() { return participantName; }
    public void setParticipantName(String participantName) { this.participantName = participantName; }

    public String getParticipantEmail() { return participantEmail; }
    public void setParticipantEmail(String participantEmail) { this.participantEmail = participantEmail; }
}
