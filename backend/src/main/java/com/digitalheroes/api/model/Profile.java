package com.digitalheroes.api.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true)
    private String email;

    @Column
    private String password;

    @Column(nullable = false)
    private String role; // 'public_visitor', 'subscriber', 'admin'

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(name = "subscription_status")
    private String subscriptionStatus; // 'active', 'inactive', 'canceled', 'lapsed'

    @Column(name = "subscription_plan")
    private String subscriptionPlan; // 'monthly', 'yearly'

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "selected_charity_id")
    private Charity selectedCharity;

    @Column(name = "charity_percentage", nullable = false, precision = 5, scale = 2)
    private BigDecimal charityPercentage = new BigDecimal("10.00");
}
