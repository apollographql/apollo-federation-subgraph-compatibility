package com.apollographql.federation.compatibility;

import com.apollographql.federation.compatibility.model.Product;
import com.apollographql.federation.graphqljava.Federation;
import com.apollographql.federation.graphqljava._Entity;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.boot.autoconfigure.graphql.GraphQlSourceBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GraphQLConfiguration {

    @Bean
    public GraphQlSourceBuilderCustomizer federationTransform() {
        return builder -> {
            builder.schemaFactory((registry, wiring) ->
                    Federation.transform(registry, wiring)
                            .fetchEntities(env ->
                                env.<List<Map<String, Object>>>getArgument(_Entity.argumentName).stream().map(reference -> {
                                    if ("Product".equals(reference.get("__typename"))) {
                                        return Product.resolveReference(reference);
                                    }
                                    return null;
                                }).collect(Collectors.toList())
                            )
                            .resolveEntityType(env -> {
                                final Object src = env.getObject();
                                if (src instanceof Product) {
                                    return env.getSchema().getObjectType("Product");
                                }
                                return null;
                            })
                            .build()
            );
        };
    }
}