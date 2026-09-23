package com.digitalheroes.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "draw_winners")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class DrawWinner {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "draw_id", nullable = false)
    private Draw draw;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private Profile user;

    @Column(name = "match_tier", nullable = false)
    private String matchTier; // '5-number', '4-number', '3-number'

    @Column(name = "prize_amount", precision = 12, scale = 2)
    private BigDecimal prizeAmount;

    @Column(name = "proof_image_url")
    private String proofImageUrl;

    @Column(name = "payout_status", nullable = false)
    private String payoutStatus = "pending"; // 'pending', 'paid'
}
