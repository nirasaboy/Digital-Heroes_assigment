package com.digitalheroes.api.repository;

import com.digitalheroes.api.model.DrawWinner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface DrawWinnerRepository extends JpaRepository<DrawWinner, UUID> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = {"user"})
    List<DrawWinner> findByDrawId(UUID drawId);
}
