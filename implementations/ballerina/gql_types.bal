import ballerina/graphql.subgraph;
import ballerina/graphql;

@subgraph:Entity {
    key: ["id", "sku package", "sku variation { id }"],
    resolveReference: resolveProduct
}
public type Product record {
    @graphql:ID string id;
    string? sku;
    string? package;
    ProductVariation? variation;
    ProductDimension? dimensions;
    User? createdBy;
    string? notes;
    ProductResearch[] research;
};

@subgraph:Entity {
    key: "sku package",
    resolveReference: resolveDeprecatedProduct
}
public type DeprecatedProduct record {
    string sku;
    string package;
    string? reason;
    User? createdBy;
};

public type ProductVariation record {
    @graphql:ID string id;
};

@subgraph:Entity {
    key: "study { caseNumber }",
    resolveReference: resolveProductResearch
}
public type ProductResearch record {
    CaseStudy study;
    string? outcome;
};

public type CaseStudy record {
    @graphql:ID string caseNumber;
    string? description;
};

public type ProductDimension record {
    string? size;
    float? weight;
    string? unit;
};

@subgraph:Entity {
    key: "email",
    resolveReference: resolveUser
}
public type User record {
    string? name;
    @graphql:ID string email;
    int yearsOfEmployment;
    int? totalProductsCreated;
    int? averageProductsCreatedPerYear;
};
