package com.netflix.graphql.dgs.compatibility;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation;

@Configuration
public class AppConfiguration {
    @Bean
    public graphql.execution.instrumentation.Instrumentation federatedTracingInstrumentation() {
        return new FederatedTracingInstrumentation();
    }
}
