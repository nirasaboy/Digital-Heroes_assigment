package com.digitalheroes.api.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "draws")
@Data
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@NoArgsConstructor
@AllArgsConstructor
public class Draw {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "draw_date", nullable = false)
    private String drawDate;

    @Column(name = "draw_type", nullable = false)
    private String drawType; // 'random', 'algorithmic'

    @Column(nullable = false)
    private String status; // 'draft', 'simulated', 'published'

    @JsonIgnore
    @ElementCollection
    @CollectionTable(name = "draw_winning_numbers", joinColumns = @JoinColumn(name = "draw_id"))
    @Column(name = "winning_number")
    private List<Integer> winningNumbers;

    @Column(name = "total_pool_amount", precision = 12, scale = 2)
    private BigDecimal totalPoolAmount;

    @Column(name = "jackpot_carried_over", precision = 12, scale = 2)
    private BigDecimal jackpotCarriedOver;
}
