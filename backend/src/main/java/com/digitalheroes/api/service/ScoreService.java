package com.digitalheroes.api.service;

import com.digitalheroes.api.model.Profile;
import com.digitalheroes.api.model.Score;
import com.digitalheroes.api.repository.ProfileRepository;
import com.digitalheroes.api.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ScoreService {

    private final ScoreRepository scoreRepository;
    private final ProfileRepository profileRepository;

    @Transactional
    public Score addScore(UUID userId, Score newScore) {
        Profile user = profileRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check for duplicate date before hitting the DB unique constraint
        boolean dateExists = scoreRepository.findByUserIdOrderByScoreDateDesc(userId)
                .stream()
                .anyMatch(s -> s.getScoreDate().equals(newScore.getScoreDate()));
        if (dateExists) {
            throw new IllegalStateException("A score for " + newScore.getScoreDate() + " already exists. Please choose a different date.");
        }

        newScore.setUser(user);
        Score savedScore = scoreRepository.save(newScore);

        // Enforce rolling 5-score limit
        enforceScoreLimit(userId);

        return savedScore;
    }

    private void enforceScoreLimit(UUID userId) {
        List<Score> scores = scoreRepository.findByUserIdOrderByScoreDateDesc(userId);
        
        if (scores.size() > 5) {
            List<Score> scoresToDelete = scores.subList(5, scores.size());
            scoreRepository.deleteAll(scoresToDelete);
        }
    }

    public List<Score> getUserScores(UUID userId) {
        return scoreRepository.findByUserIdOrderByScoreDateDesc(userId);
    }
}
