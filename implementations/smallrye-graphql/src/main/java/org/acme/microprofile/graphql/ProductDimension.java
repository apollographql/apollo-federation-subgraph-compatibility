package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.federation.Shareable;
import io.smallrye.graphql.api.federation.Inaccessible;
import org.eclipse.microprofile.graphql.NonNull;

@Shareable
public class ProductDimension {
    private final String size;
    private final Float weight;
    @Inaccessible
    private final String unit;

    public ProductDimension(String size, float weight, String unit) {
        this.size = size;
        this.weight = weight;
        this.unit = unit;
    }

    public String getSize() {
        return size;
    }

    public Float getWeight() {
        return weight;
    }

    public String getUnit() {
        return unit;
    }
}
