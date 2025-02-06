package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.Subscription;
import io.smallrye.mutiny.Multi;
import io.smallrye.mutiny.operators.multi.processors.BroadcastProcessor;
import org.eclipse.microprofile.graphql.GraphQLApi;
import org.eclipse.microprofile.graphql.Query;
import org.eclipse.microprofile.graphql.Mutation;
import org.eclipse.microprofile.graphql.Name;
import org.eclipse.microprofile.graphql.Source;
import org.eclipse.microprofile.graphql.Description;
import org.acme.microprofile.graphql.InventoryService;
import org.acme.microprofile.graphql.ProductService;
import org.acme.microprofile.graphql.UserService;
import org.eclipse.microprofile.graphql.DefaultValue;
import org.eclipse.microprofile.graphql.Source;
import io.smallrye.graphql.api.federation.Requires;
import io.smallrye.graphql.api.federation.Resolver;
import io.smallrye.graphql.api.federation.FieldSet;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@GraphQLApi
@ApplicationScoped
public class InventoryResource {
    @Inject
    InventoryService service;
 
    @Resolver
    public Inventory resolveById(String id) {
        return InventoryService.resolveById(id);
    }
}
