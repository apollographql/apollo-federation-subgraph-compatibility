isolated function getProductById(string id) returns Product|error? {
    return trap products.filter(product => product.id == id).shift();
}

isolated function getProductBySkuAndPackage(string sku, string package) returns Product|error? {
    return trap products.filter(product => product.sku == sku && product.package == package).shift();
}

isolated function getProductBySkuAndVariationId(string sku, string variationId) returns Product|error? {
    var productFilter = productFilter(sku, variationId);
    return trap products.filter(productFilter).shift();
}

isolated function productFilter(string sku, string variationId)
returns isolated function (Product product) returns boolean {
    return isolated function(Product product) returns boolean {
        ProductVariation? variation = product.variation;
        return product.sku == sku && variation !is () && variation.id == variationId;
    };
}

isolated function getProductResearchByCaseNumber(string caseNumber) returns ProductResearch|error? {
    return trap productsResearch.filter(product => product.study.caseNumber == caseNumber).shift();
}
