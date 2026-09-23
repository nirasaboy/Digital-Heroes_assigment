package com.digitalheroes.api.service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripeService {

    @Value("${stripe.secret-key}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    public String createCheckoutSession(String userId, String planType) throws StripeException {
        // Monthly = £9.99, Yearly = £99.99 (prices in pence/cents)
        long unitAmount = "yearly".equals(planType) ? 9999L : 999L;
        String interval = "yearly".equals(planType) ? "year" : "month";

        SessionCreateParams params = SessionCreateParams.builder()
            .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
            .setSuccessUrl("http://localhost:3000/dashboard?session_id={CHECKOUT_SESSION_ID}")
            .setCancelUrl("http://localhost:3000/dashboard")
            .putMetadata("userId", userId)
            .putMetadata("planType", planType)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency("gbp")
                            .setUnitAmount(unitAmount)
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName("Digital Heroes - " + (interval.equals("year") ? "Yearly" : "Monthly") + " Subscription")
                                    .setDescription("Golf performance tracking, charity fundraising & monthly draws")
                                    .build()
                            )
                            .setRecurring(
                                SessionCreateParams.LineItem.PriceData.Recurring.builder()
                                    .setInterval(
                                        "year".equals(interval)
                                            ? SessionCreateParams.LineItem.PriceData.Recurring.Interval.YEAR
                                            : SessionCreateParams.LineItem.PriceData.Recurring.Interval.MONTH
                                    )
                                    .build()
                            )
                            .build()
                    )
                    .build()
            )
            .build();

        Session session = Session.create(params);
        return session.getUrl();
    }
}
