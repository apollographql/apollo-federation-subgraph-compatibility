package graphql.kickstart.federation.compatibility.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductDimension {

    private final String size;
    private final float weight;
    private final String unit;

}
