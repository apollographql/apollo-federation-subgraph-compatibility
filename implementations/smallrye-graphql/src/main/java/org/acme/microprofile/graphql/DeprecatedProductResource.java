package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.Subscription;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.operators.multi.processors.BroadcastProcessor;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.*;
import org.acme.microprofile.graphql.ProductService;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@GraphQLApi
@ApplicationScoped
public class DeprecatedProductResource {
    @Inject
    DeprecatedProductService service;
 
    @Query
    @Deprecated
    public DeprecatedProduct deprecatedProduct(@Name("sku") @NonNull String sku, @Name("package") @NonNull String productPackage) {
        return service.getDeprecatedProduct(sku, productPackage);
    }
}