package com.netflix.graphql.dgs.compatibility;

import java.util.Collections;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.graphql.server.WebGraphQlInterceptor;
import com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation;

import static com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation.FEDERATED_TRACING_HEADER_NAME;

@Configuration
public class AppConfiguration {
    @Bean
    public graphql.execution.instrumentation.Instrumentation federatedTracingInstrumentation() {
        return new FederatedTracingInstrumentation();
    }

    // FederatedTracingInstrumentation reads the tracing header from the GraphQLContext
    @Bean
    public WebGraphQlInterceptor federatedTracingInterceptor() {
        return (request, chain) -> {
            String headerValue = request.getHeaders().getFirst(FEDERATED_TRACING_HEADER_NAME);
            if (headerValue != null) {
                request.configureExecutionInput((executionInput, builder) ->
                        builder.graphQLContext(Collections.singletonMap(FEDERATED_TRACING_HEADER_NAME, headerValue)).build());
            }
            return chain.next(request);
        };
    }
}
