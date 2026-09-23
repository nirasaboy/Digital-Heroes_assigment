package com.digitalheroes.api.controller;

import com.digitalheroes.api.model.Score;
import com.digitalheroes.api.service.ScoreService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;

    @PostMapping("/{userId}")
    public ResponseEntity<?> addScore(@PathVariable UUID userId, @Valid @RequestBody Score score) {
        try {
            Score newScore = scoreService.addScore(userId, score);
            return ResponseEntity.ok(newScore);
        } catch (IllegalStateException e) {
            // Duplicate date
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        } catch (IllegalArgumentException e) {
            // User not found
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Score>> getUserScores(@PathVariable UUID userId) {
        List<Score> scores = scoreService.getUserScores(userId);
        return ResponseEntity.ok(scores);
    }
}
