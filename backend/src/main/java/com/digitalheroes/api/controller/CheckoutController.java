package com.digitalheroes.api.controller;

import com.digitalheroes.api.service.StripeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@RequiredArgsConstructor
public class CheckoutController {

    private final StripeService stripeService;

    @PostMapping("/create-session")
    public ResponseEntity<Map<String, String>> createCheckoutSession(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String planType = request.get("planType"); // 'monthly' or 'yearly'
            
            String checkoutUrl = stripeService.createCheckoutSession(userId, planType);
            return ResponseEntity.ok(Map.of("url", checkoutUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
