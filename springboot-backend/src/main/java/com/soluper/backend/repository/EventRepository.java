package com.soluper.backend.repository;

import com.soluper.backend.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByTagIgnoreCase(String tag);
    List<Event> findByStatusIgnoreCase(String status);
}
