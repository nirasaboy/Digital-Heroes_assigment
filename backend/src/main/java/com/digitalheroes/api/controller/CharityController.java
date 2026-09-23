package com.digitalheroes.api.controller;

import com.digitalheroes.api.model.Charity;
import com.digitalheroes.api.repository.CharityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/charities")
@RequiredArgsConstructor
public class CharityController {

    private final CharityRepository charityRepository;

    @GetMapping
    public ResponseEntity<List<Charity>> getAllCharities() {
        return ResponseEntity.ok(charityRepository.findAll());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Charity>> getFeaturedCharities() {
        return ResponseEntity.ok(charityRepository.findByIsFeaturedTrue());
    }

    @PostMapping
    public ResponseEntity<Charity> createCharity(@RequestBody Charity charity) {
        return ResponseEntity.ok(charityRepository.save(charity));
    }
}
