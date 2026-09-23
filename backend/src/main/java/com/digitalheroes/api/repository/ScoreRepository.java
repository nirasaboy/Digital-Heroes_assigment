package com.digitalheroes.api.repository;

import com.digitalheroes.api.model.Score;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ScoreRepository extends JpaRepository<Score, UUID> {
    List<Score> findByUserIdOrderByScoreDateDesc(UUID userId);
}
