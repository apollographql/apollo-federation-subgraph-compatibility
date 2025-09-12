using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("sku package")]
public class DeprecatedProduct
{
    public DeprecatedProduct(string sku, string package, string? reason, User? createdBy)
    {
        Sku = sku;
        Package = package;
        Reason = reason;
        CreatedBy = createdBy;
    }

    public string Sku { get; }

    public string Package { get; }

    public string? Reason { get; }

    public User? CreatedBy { get; }

    [FederationResolver]
    public static DeprecatedProduct? ResolveBySkuAndPackage(string sku, string package, [FromServices] Data data)
        => data.DeprecatedProducts.FirstOrDefault(t => t.Sku == sku && t.Package == package);
}
