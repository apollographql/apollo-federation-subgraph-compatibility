package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.Subscription;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.operators.multi.processors.BroadcastProcessor;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Description;
import org.eclipse.microprofile.graphql.Id;
import org.eclipse.microprofile.graphql.NonNull;
import io.smallrye.graphql.api.AdaptToScalar;
import io.smallrye.graphql.api.Scalar;
import org.acme.microprofile.graphql.ProductService;
import org.acme.microprofile.graphql.UserService;
import org.eclipse.microprofile.graphql.DefaultValue;
import org.eclipse.microprofile.graphql.Source;
import io.smallrye.graphql.api.federation.Resolver;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@GraphQLApi
@ApplicationScoped
public class ProductResource {
    @Inject
    ProductService service;
 
    @Query
    public Product product(@Name("id") @Id @NonNull String id) {
        return service.getProduct(id);
    }

    @Resolver
    public Product resolveById(String id) {
        return ProductService.resolveById(id);
    }

    @Resolver
    public Product resolveBySkuAndPackage(String sku, @Name("package") String pkg) {
        return ProductService.resolveBySkuAndPackage(sku, pkg);
    }

    @Resolver
    public Product resolveBySkuAndVariation(String sku, Object variation) {
        return ProductService.resolveBySkuAndVariation(sku, variation);
    }
}