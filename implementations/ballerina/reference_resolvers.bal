import ballerina/graphql.subgraph;

type ProductKeyFields record {
    string id?;
    *DepricatedProductKeyFields;
    record {string id;} variation?;
};

type DepricatedProductKeyFields record {
    string sku?;
    string package?;
};

type ProductResearchKeyFields record {
    record {string caseNumber;} study?;
};

isolated function resolveProduct(subgraph:Representation representation) returns Product|error? {
    ProductKeyFields {id, sku, package, variation} = check representation.cloneWithType();
    if id is string {
        return getProductById(id);
    }
    if sku is string && package is string {
        return getProductBySkuAndPackage(sku, package);
    }
    if sku is string && variation !is () {
        return getProductBySkuAndVariationId(sku, variation.id);
    }
    return error("Primary key for Product not found");
}

isolated function resolveDeprecatedProduct(subgraph:Representation representation) returns DeprecatedProduct|error? {
    DepricatedProductKeyFields {sku, package} = check representation.cloneWithType();
    if sku is string && package is string {
        return deprecatedProduct.sku == sku && deprecatedProduct.package == package ? deprecatedProduct : ();
    }
    return error("Primary key for DeprecatedProduct not found");
}

isolated function resolveProductResearch(subgraph:Representation representation) returns ProductResearch|error? {
    ProductResearchKeyFields {study} = check representation.cloneWithType();
    if study !is () {
        return getProductResearchByCaseNumber(study.caseNumber);
    }
    return error("Primary key for Product research not found");

}

isolated function resolveUser(subgraph:Representation representation) returns User|error? {
    string email = check representation["email"].ensureType();
    return user.email == email ? user : ();
}
