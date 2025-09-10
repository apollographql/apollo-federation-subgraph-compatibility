using GraphQL;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

public class Query
{
    public static Product? Product([Id] string id, [FromServices] Data repository)
        => repository.Products.FirstOrDefault(t => t.Id == id);

    [Obsolete("Use product query instead")]
    public static DeprecatedProduct? DeprecatedProduct(string sku, string package, [FromServices] Data repository)
        => repository.DeprecatedProducts.FirstOrDefault(t => t.Sku == sku && t.Package == package);
}
