async function productById({ args, graphql }) {
    const results = await graphql(`query GetProductById($productId: String!) { 
        getProduct(id: $productId) {
            id
            sku
            package
            variation { id }
            dimensions { size weight unit }
            createdBy { email name totalProductsCreated }
            research { study { caseNumber description }}
        }
    }`, {"productId": args.id})
    return results.data.getProduct
  }

async function deprecatedProductBySkuAndPackage({ args, graphql }) {
    console.log("executing deprecated product by sku and package", args)
    const results = await graphql(`query GetDeprecatedProductBySkuAndPackage($sku: String!, $pkg: String!) { 
        getDeprecatedProduct(sku: $sku, package: $pkg) {
            sku
            package
            reason
            createdBy { email name totalProductsCreated }
        }
    }`, {"sku": args.sku, "pkg": args.package})
    console.log("executed query")
    console.log("results", results)
    return results.data.getDeprecatedProduct
}

async function userAverageProductsCreatedPerYear({parent: {totalProductsCreated, yearsOfEmployment}}) {
    if (totalProductsCreated) { 
        Math.round(totalProductsCreated / yearsOfEmployment)
      } else { 
        null
      }
}

self.addGraphQLResolvers({
    "Query.product": productById,
    "Query.deprecatedProduct": deprecatedProductBySkuAndPackage,
    "User.averageProductsCreatedPerYear": userAverageProductsCreatedPerYear
})
