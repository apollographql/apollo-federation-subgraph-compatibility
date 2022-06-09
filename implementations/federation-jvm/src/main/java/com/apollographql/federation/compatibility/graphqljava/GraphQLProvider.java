package com.apollographql.federation.compatibility.graphqljava;

import static graphql.schema.idl.TypeRuntimeWiring.newTypeWiring;

import com.apollographql.federation.graphqljava.Federation;
import com.apollographql.federation.graphqljava._Entity;
import com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation;
import graphql.GraphQL;
import graphql.schema.GraphQLSchema;
import graphql.schema.idl.RuntimeWiring;
import graphql.schema.idl.SchemaParser;
import graphql.schema.idl.TypeDefinitionRegistry;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Component;

@Component
public class GraphQLProvider {

    @Autowired
    GraphQLDataFetchers graphQLDataFetchers;

    @Bean
    public GraphQL graphql() throws IOException {
        String sdl = getSDL();
        GraphQLSchema graphQLSchema = buildSchema(sdl);
        return GraphQL.newGraphQL(graphQLSchema)
            .instrumentation(federatedTracing()).build();
    }

    private FederatedTracingInstrumentation federatedTracing() {
        return new FederatedTracingInstrumentation();
    }

    private String getSDL() throws IOException {
        Resource sdl = new ClassPathResource("schemas/products.graphql");

        String schema = new BufferedReader(new InputStreamReader(sdl.getInputStream())).lines()
            .collect((Collectors.joining("\n")));

        return schema;
    }

    private GraphQLSchema buildSchema(String sdl) throws IOException {
        TypeDefinitionRegistry typeRegistry = new SchemaParser().parse(sdl);
        RuntimeWiring runtimeWiring = buildWiring();

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

    private RuntimeWiring buildWiring() {
        return RuntimeWiring.newRuntimeWiring()
            .type(newTypeWiring("Query")
                .dataFetcher("product", graphQLDataFetchers.getProductDataFetcher())
            ).build();
    }
}
