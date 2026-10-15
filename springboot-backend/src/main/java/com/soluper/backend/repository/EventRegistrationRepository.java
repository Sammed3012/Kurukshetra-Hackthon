package com.soluper.backend.repository;

import com.soluper.backend.model.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByEventId(Long eventId);
    List<EventRegistration> findByParticipantEmail(String participantEmail);
    boolean existsByEventIdAndParticipantEmail(Long eventId, String participantEmail);
}
