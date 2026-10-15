package com.soluper.backend.service;

import com.soluper.backend.dto.EventRegistrationRequest;
import com.soluper.backend.model.Event;
import com.soluper.backend.model.EventRegistration;
import com.soluper.backend.repository.EventRegistrationRepository;
import com.soluper.backend.repository.EventRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventRegistrationRepository registrationRepository;

    public EventService(EventRepository eventRepository, EventRegistrationRepository registrationRepository) {
        this.eventRepository = eventRepository;
        this.registrationRepository = registrationRepository;
    }

    public List<Event> getAll(String tag, String status) {
        if (tag != null && !tag.trim().isEmpty()) {
            return eventRepository.findByTagIgnoreCase(tag.trim());
        }
        if (status != null && !status.trim().isEmpty()) {
            return eventRepository.findByStatusIgnoreCase(status.trim());
        }
        return eventRepository.findAll();
    }

    public Optional<Event> getById(Long id) {
        return eventRepository.findById(id);
    }

    public Event create(Event event) {
        return eventRepository.save(event);
    }

    public Event update(Long id, Event updated) {
        return eventRepository.findById(id).map(existing -> {
            if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
            if (updated.getDate() != null) existing.setDate(updated.getDate());
            if (updated.getTime() != null) existing.setTime(updated.getTime());
            if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
            if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
            if (updated.getTag() != null) existing.setTag(updated.getTag());
            if (updated.getImage() != null) existing.setImage(updated.getImage());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            return eventRepository.save(existing);
        }).orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + id));
    }

    public void delete(Long id) {
        eventRepository.deleteById(id);
    }

    public EventRegistration registerParticipant(Long eventId, EventRegistrationRequest req) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + eventId));

        if (registrationRepository.existsByEventIdAndParticipantEmail(eventId, req.getParticipantEmail().toLowerCase().trim())) {
            throw new IllegalArgumentException("You are already registered for this event.");
        }

        EventRegistration reg = new EventRegistration(
                eventId,
                event.getTitle(),
                req.getParticipantName().trim(),
                req.getParticipantEmail().toLowerCase().trim()
        );

        return registrationRepository.save(reg);
    }

    public List<EventRegistration> getRegistrations(Long eventId) {
        return registrationRepository.findByEventId(eventId);
    }
}
