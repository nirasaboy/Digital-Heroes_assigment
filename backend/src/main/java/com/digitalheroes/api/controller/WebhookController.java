package com.digitalheroes.api.controller;

import com.digitalheroes.api.model.Profile;
import com.digitalheroes.api.repository.ProfileRepository;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.EventDataObjectDeserializer;
import com.stripe.model.StripeObject;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/webhooks")
@RequiredArgsConstructor
public class WebhookController {

    private final ProfileRepository profileRepository;

    @Value("${stripe.webhook.secret}")
    private String endpointSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(@RequestBody String payload, @RequestHeader("Stripe-Signature") String sigHeader) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, endpointSecret);
        } catch (SignatureVerificationException e) {
            System.out.println("Webhook signature verification failed.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("");
        }

        EventDataObjectDeserializer dataObjectDeserializer = event.getDataObjectDeserializer();
        StripeObject stripeObject = null;
        if (dataObjectDeserializer.getObject().isPresent()) {
            stripeObject = dataObjectDeserializer.getObject().get();
        }

        if ("checkout.session.completed".equals(event.getType())) {
            Session session = (Session) stripeObject;
            if (session != null && session.getMetadata() != null) {
                String userId = session.getMetadata().get("userId");
                
                if (userId != null) {
                    Optional<Profile> optionalProfile = profileRepository.findById(UUID.fromString(userId));
                    if (optionalProfile.isPresent()) {
                        Profile profile = optionalProfile.get();
                        profile.setSubscriptionStatus("active");
                        profile.setStripeCustomerId(session.getCustomer());
                        profileRepository.save(profile);
                        System.out.println("User " + userId + " subscription activated successfully.");
                    }
                }
            }
        }

        return ResponseEntity.ok("");
    }
}
