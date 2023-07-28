import ballerina/graphql;
import ballerina/graphql.subgraph as subg;

@subg:Subgraph
@graphql:ServiceConfig {
    cors: {
        allowOrigins: ["*"]
    }
}
service on new graphql:Listener(4001) {
    resource function get product(@graphql:ID string id) returns Product|error? {
        return getProductById(id);
    }

    # # Deprecated
    # Use product query instead
    @deprecated
    resource function get deprecatedProduct(string sku, string package) returns DeprecatedProduct? {
        return deprecatedProduct;
    }
}
