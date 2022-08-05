package graphql.kickstart.federation.compatibility.federation;

import com.apollographql.federation.graphqljava.Federation;
import com.apollographql.federation.graphqljava._Entity;
import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.federation.compatibility.model.User;
import graphql.kickstart.federation.compatibility.resolvers.ProductReferenceResolver;
import graphql.kickstart.federation.compatibility.resolvers.UserReferenceResolver;
import graphql.kickstart.tools.SchemaParser;
import graphql.schema.GraphQLSchema;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class FederatedSchema {

    @Bean
    public GraphQLSchema federatedGraphQLSchema(SchemaParser schemaParser) {
        // TODO FIXME: kickstart executable schema doesn't contain schema directives, so the @link tests currently fail :'(
        return Federation.transform(schemaParser.makeExecutableSchema())
                .fetchEntities(env ->
                        env.<List<Map<String, Object>>>getArgument(_Entity.argumentName).stream().map(reference -> {
                            if ("Product".equals(reference.get("__typename"))) {
                                return ProductReferenceResolver.resolveReference(reference);
                            } else if ("User".equals(reference.get("__typename"))) {
                                return UserReferenceResolver.resolveReference(reference);
                            } else {
                                return null;
                            }
                        }).collect(Collectors.toList())
                )
                .resolveEntityType(env -> {
                    final Object src = env.getObject();
                    if (src instanceof Product) {
                        return env.getSchema().getObjectType("Product");
                    } else if (src instanceof User) {
                        return env.getSchema().getObjectType("User");
                    } else {
                        return null;
                    }
                })
                .build();
    }
}


