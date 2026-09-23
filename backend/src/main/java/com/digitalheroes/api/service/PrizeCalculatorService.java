package com.digitalheroes.api.service;

import com.digitalheroes.api.model.Draw;
import com.digitalheroes.api.model.DrawWinner;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PrizeCalculatorService {

    private static final BigDecimal MATCH_5_SHARE = new BigDecimal("0.40");
    private static final BigDecimal MATCH_4_SHARE = new BigDecimal("0.35");
    private static final BigDecimal MATCH_3_SHARE = new BigDecimal("0.25");

    public void calculateAndDistributePrizes(Draw draw, List<DrawWinner> winners) {
        BigDecimal totalPool = draw.getTotalPoolAmount();
        if (totalPool == null || totalPool.compareTo(BigDecimal.ZERO) <= 0) return;

        BigDecimal pool5 = totalPool.multiply(MATCH_5_SHARE);
        BigDecimal pool4 = totalPool.multiply(MATCH_4_SHARE);
        BigDecimal pool3 = totalPool.multiply(MATCH_3_SHARE);

        // Add carried over jackpot to match-5 pool if exists
        if (draw.getJackpotCarriedOver() != null) {
            pool5 = pool5.add(draw.getJackpotCarriedOver());
        }

        long match5Count = winners.stream().filter(w -> "5-number".equals(w.getMatchTier())).count();
        long match4Count = winners.stream().filter(w -> "4-number".equals(w.getMatchTier())).count();
        long match3Count = winners.stream().filter(w -> "3-number".equals(w.getMatchTier())).count();

        // Rollover logic for 5-match
        if (match5Count == 0) {
            draw.setJackpotCarriedOver(pool5); // Will carry over to next month
        } else {
            BigDecimal prize5 = pool5.divide(BigDecimal.valueOf(match5Count), 2, RoundingMode.DOWN);
            winners.stream().filter(w -> "5-number".equals(w.getMatchTier())).forEach(w -> w.setPrizeAmount(prize5));
            draw.setJackpotCarriedOver(BigDecimal.ZERO);
        }

        // 4-match split
        if (match4Count > 0) {
            BigDecimal prize4 = pool4.divide(BigDecimal.valueOf(match4Count), 2, RoundingMode.DOWN);
            winners.stream().filter(w -> "4-number".equals(w.getMatchTier())).forEach(w -> w.setPrizeAmount(prize4));
        }

        // 3-match split
        if (match3Count > 0) {
            BigDecimal prize3 = pool3.divide(BigDecimal.valueOf(match3Count), 2, RoundingMode.DOWN);
            winners.stream().filter(w -> "3-number".equals(w.getMatchTier())).forEach(w -> w.setPrizeAmount(prize3));
        }
    }
}
