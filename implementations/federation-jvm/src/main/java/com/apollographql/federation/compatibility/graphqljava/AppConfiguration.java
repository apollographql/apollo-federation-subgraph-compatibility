package com.apollographql.federation.compatibility.graphqljava;

import com.apollographql.federation.graphqljava.Federation;
import com.apollographql.federation.graphqljava._Entity;
import com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation;
import graphql.schema.DataFetcher;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.io.Resource;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation.FEDERATED_TRACING_HEADER_VALUE;
import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;

@Configuration
@Profile("graphql-java")
public class AppConfiguration {

    @Bean
    public GraphQLSchema graphQLSchema(@Value("classpath:schemas/graphql-java/products.graphql") Resource sdl)
            throws IOException {

        String schema = new BufferedReader(new InputStreamReader(sdl.getInputStream())).lines()
                .collect((Collectors.joining("\n")));

        TypeDefinitionRegistry typeRegistry = new SchemaParser().parse(schema);
        RuntimeWiring runtimeWiring = RuntimeWiring.newRuntimeWiring()
                .type(newTypeWiring("Query")
                        .dataFetcher("product", getProductDataFetcher())
                ).build();

        return Federation.transform(typeRegistry, runtimeWiring)
                .fetchEntities(
                        env -> env.<List<Map<String, Object>>>getArgument(_Entity.argumentName).stream().map(reference -> {
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

    public DataFetcher getProductDataFetcher() {
        return dataFetchingEnvironment -> {
            String productId = dataFetchingEnvironment.getArgument("id");
            return Product.products.stream().filter(product -> product.getId().equals(productId)).findFirst()
                    .orElse(null);
        };
    }

    @Bean
    public FederatedTracingInstrumentation federatedTracingInstrumentation() {
        FederatedTracingInstrumentation.Options options = new FederatedTracingInstrumentation.Options(false, executionInput -> {
            if (executionInput.getContext() instanceof Context) {
                return FEDERATED_TRACING_HEADER_VALUE.equals(((Context) executionInput.getContext()).getTracingHeader());
            }
            return false;
        });
        return new FederatedTracingInstrumentation(options);
    }
}
