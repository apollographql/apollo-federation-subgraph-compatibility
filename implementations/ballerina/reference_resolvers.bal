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

function resolveProduct(subgraph:Representation representation) returns Product|error? {
    ProductKeyFields {id, sku, package, variation} = check representation.ensureType();
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

function resolveDeprecatedProduct(subgraph:Representation representation) returns DeprecatedProduct|error? {
    DepricatedProductKeyFields {sku, package} = check representation.ensureType();
    if sku is string && package is string {
        return deprecatedProduct.sku == sku && deprecatedProduct.package == package ? deprecatedProduct : ();
    }
    return error("Primary key for DeprecatedProduct not found");
}

function resolveProductResearch(subgraph:Representation representation) returns ProductResearch|error? {
    ProductResearchKeyFields {study} = check representation.ensureType();
    if study !is () {
        return getProductResearchByCaseNumber(study.caseNumber);
    }
    return error("Primary key for Product research not found");

}

function resolveUser(subgraph:Representation representation) returns User|error? {
    string email = check representation["email"].ensureType();
    return user.email == email ? user : ();
}
