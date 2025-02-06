package org.acme.microprofile.graphql;

import org.eclipse.microprofile.graphql.NonNull;
import org.eclipse.microprofile.graphql.Id;

public class ProductVariation {
    @Id @NonNull
    private final String id;

    public ProductVariation(String id) {
        this.id = id;
    }

    public String getId() {
        return id;
    }
}