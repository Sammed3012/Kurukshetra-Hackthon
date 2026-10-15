package com.soluper.backend.repository;

import com.soluper.backend.model.Soluper;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SoluperRepository extends JpaRepository<Soluper, Long> {
    List<Soluper> findByCategoryIgnoreCase(String category);
    List<Soluper> findByStatusIgnoreCase(String status);
    List<Soluper> findByFeaturedTrue();
    List<Soluper> findByNameContainingIgnoreCase(String name);
}
