package com.digitalheroes.api.repository;

import com.digitalheroes.api.model.Draw;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DrawRepository extends JpaRepository<Draw, UUID> {
}
