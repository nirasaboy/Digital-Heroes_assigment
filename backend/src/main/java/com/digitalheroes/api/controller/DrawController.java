package com.digitalheroes.api.controller;

import com.digitalheroes.api.model.Draw;
import com.digitalheroes.api.model.DrawWinner;
import com.digitalheroes.api.repository.DrawRepository;
import com.digitalheroes.api.repository.DrawWinnerRepository;
import com.digitalheroes.api.repository.ProfileRepository;
import com.digitalheroes.api.service.PrizeCalculatorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/draws")
@RequiredArgsConstructor
public class DrawController {

    private final DrawRepository drawRepository;
    private final DrawWinnerRepository drawWinnerRepository;
    private final ProfileRepository profileRepository;
    private final PrizeCalculatorService prizeCalculatorService;

    @GetMapping
    public ResponseEntity<List<Draw>> getAllDraws() {
        return ResponseEntity.ok(drawRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Draw> createDraw(@RequestBody Draw draw) {
        // Auto-set drawDate if not provided
        if (draw.getDrawDate() == null) {
            draw.setDrawDate(java.time.ZonedDateTime.now().toString());
        }
        // Default status
        if (draw.getStatus() == null || draw.getStatus().isBlank()) {
            draw.setStatus("pending");
        }
        Draw saved = drawRepository.save(draw);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{drawId}/calculate-prizes")
    public ResponseEntity<String> calculatePrizes(@PathVariable UUID drawId) {
        Draw draw = drawRepository.findById(drawId)
                .orElseThrow(() -> new IllegalArgumentException("Draw not found"));

        // Get all users who have submitted scores
        List<com.digitalheroes.api.model.Profile> allUsers = profileRepository.findAll();

        // Filter users who have scores (we'll auto-generate winners from all registered users for demo)
        // Assign random match tiers based on user index
        String[] tiers = {"3-number", "4-number", "5-number", "3-number", "3-number"};
        java.util.List<DrawWinner> winners = new java.util.ArrayList<>();

        for (int i = 0; i < allUsers.size(); i++) {
            com.digitalheroes.api.model.Profile user = allUsers.get(i);
            DrawWinner winner = new DrawWinner();
            winner.setDraw(draw);
            winner.setUser(user);
            winner.setMatchTier(tiers[i % tiers.length]);
            winner.setPayoutStatus("pending");
            winners.add(winner);
        }

        // Save winners first so prize calculator can work on them
        winners = drawWinnerRepository.saveAll(winners);

        // Now calculate and distribute prize amounts
        prizeCalculatorService.calculateAndDistributePrizes(draw, winners);
        draw.setStatus("simulated");
        drawRepository.save(draw);
        drawWinnerRepository.saveAll(winners);

        return ResponseEntity.ok("Prizes calculated and distributed successfully. " + winners.size() + " winners selected.");
    }

    @GetMapping("/{drawId}/winners")
    public ResponseEntity<List<DrawWinner>> getDrawWinners(@PathVariable UUID drawId) {
        return ResponseEntity.ok(drawWinnerRepository.findByDrawId(drawId));
    }

    public record WinnerRequest(UUID userId, String matchTier) {}

    @PostMapping("/{drawId}/winners")
    public ResponseEntity<?> addWinner(@PathVariable UUID drawId, @RequestBody WinnerRequest request) {
        Draw draw = drawRepository.findById(drawId).orElse(null);
        if (draw == null) return ResponseEntity.status(404).body(Map.of("error", "Draw not found"));
        
        var user = profileRepository.findById(request.userId()).orElse(null);
        if (user == null) return ResponseEntity.status(404).body(Map.of("error", "User not found"));

        DrawWinner winner = new DrawWinner();
        winner.setDraw(draw);
        winner.setUser(user);
        winner.setMatchTier(request.matchTier());
        winner.setPayoutStatus("pending");
        
        return ResponseEntity.ok(drawWinnerRepository.save(winner));
    }

    public record StatusRequest(String status) {}

    @PutMapping("/{drawId}/status")
    public ResponseEntity<?> updateStatus(@PathVariable UUID drawId, @RequestBody StatusRequest request) {
        Draw draw = drawRepository.findById(drawId).orElse(null);
        if (draw == null) return ResponseEntity.status(404).body(Map.of("error", "Draw not found"));
        
        draw.setStatus(request.status());
        return ResponseEntity.ok(drawRepository.save(draw));
    }
}
