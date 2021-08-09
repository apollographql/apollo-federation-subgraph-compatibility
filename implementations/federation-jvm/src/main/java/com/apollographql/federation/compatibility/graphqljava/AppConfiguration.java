package com.apollographql.federation.compatibility.graphqljava;

import com.apollographql.federation.graphqljava.Federation;
import com.apollographql.federation.graphqljava._Entity;
import com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation;
import graphql.schema.GraphQLSchema;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Configuration
@Profile("graphql-java")
public class AppConfiguration {
    @Bean
    public GraphQLSchema graphQLSchema(@Value("classpath:schemas/graphql-java/products.graphql") Resource sdl)
            throws IOException {
        System.out.println("TEST" + sdl.toString());
        return Federation
                .transform(new BufferedReader(new InputStreamReader(sdl.getInputStream())).lines()
                        .collect((Collectors.joining("\n"))))
                .fetchEntities(env -> env.<List<Map<String, Object>>>getArgument(_Entity.argumentName).stream()
                        .map(reference -> {
                            if ("Product".equals(reference.get("__typename"))) {
                                return Product.resolveReference(reference);
                            }
                            return null;
                        }).collect(Collectors.toList()))
                .resolveEntityType(env -> {
                    final Object src = env.getObject();
                    if (src instanceof Product) {
                        return env.getSchema().getObjectType("Product");
                    }
                    return null;
                }).build();
    }

    @Bean
    public FederatedTracingInstrumentation federatedTracingInstrumentation() {
        return new FederatedTracingInstrumentation(new FederatedTracingInstrumentation.Options(true));
    }
}
