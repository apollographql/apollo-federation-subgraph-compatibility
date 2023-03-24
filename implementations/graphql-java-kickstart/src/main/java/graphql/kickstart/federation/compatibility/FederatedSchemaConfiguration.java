package graphql.kickstart.federation.compatibility;

import com.apollographql.federation.graphqljava.Federation;
import com.apollographql.federation.graphqljava._Entity;
import graphql.kickstart.federation.compatibility.model.DeprecatedProduct;
import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.federation.compatibility.model.ProductResearch;
import graphql.kickstart.federation.compatibility.model.User;
import graphql.kickstart.federation.compatibility.resolvers.DeprecatedProductReferenceResolver;
import graphql.kickstart.federation.compatibility.resolvers.ProductReferenceResolver;
import graphql.kickstart.federation.compatibility.resolvers.ProductResearchReferenceResolver;
import graphql.kickstart.federation.compatibility.resolvers.UserReferenceResolver;
import graphql.kickstart.tools.SchemaParser;
import graphql.schema.GraphQLSchema;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class FederatedSchemaConfiguration {

    @Bean
    public GraphQLSchema federatedGraphQLSchema(SchemaParser schemaParser) {
        // TODO FIXME: kickstart executable schema doesn't contain schema directives, so the @link tests currently fail :'(
        return Federation.transform(schemaParser.makeExecutableSchema())
                .setFederation2(true)
                .fetchEntities(env ->
                    env.<List<Map<String, Object>>>getArgument(_Entity.argumentName).stream().map(reference -> {
                        final String typeName = (String)reference.get("__typename");
                        return switch (typeName) {
                            case "DeprecatedProduct" -> DeprecatedProductReferenceResolver.resolveReference(reference);
                            case "Product" -> ProductReferenceResolver.resolveReference(reference);
                            case "ProductResearch" -> ProductResearchReferenceResolver.resolveReference(reference);
                            case "User" -> UserReferenceResolver.resolveReference(reference);
                            default -> null;
                        };
                    }).collect(Collectors.toList())
                )
                .resolveEntityType(env -> {
                    final Object src = env.getObject();
                    if (src instanceof DeprecatedProduct) {
                        return env.getSchema().getObjectType("DeprecatedProduct");
                    } else if (src instanceof Product) {
                        return env.getSchema().getObjectType("Product");
                    } else if (src instanceof ProductResearch) {
                        return env.getSchema().getObjectType("ProductResearch");
                    } else if (src instanceof User) {
                        return env.getSchema().getObjectType("User");
                    } else {
                        return null;
                    }
                })
                .build();
    }
}


