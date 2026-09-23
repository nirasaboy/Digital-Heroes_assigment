package com.digitalheroes.api.config;

import com.fasterxml.jackson.datatype.hibernate6.Hibernate6Module;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public Jackson2ObjectMapperBuilderCustomizer jacksonCustomizer() {
        return builder -> {
            // Register Hibernate module to handle lazy-load proxies gracefully
            Hibernate6Module hibernate6Module = new Hibernate6Module();
            hibernate6Module.configure(Hibernate6Module.Feature.FORCE_LAZY_LOADING, false);
            builder.modulesToInstall(hibernate6Module, new com.fasterxml.jackson.datatype.jsr310.JavaTimeModule());
            builder.featuresToDisable(com.fasterxml.jackson.databind.SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        };
    }
}

