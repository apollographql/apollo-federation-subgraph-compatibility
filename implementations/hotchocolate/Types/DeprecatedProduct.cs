using ApolloGraphQL.HotChocolate.Federation;

namespace Products;

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

    [ReferenceResolver]
    public static DeprecatedProduct? GetProductByPackage(
        string sku,
        string package,
        Data repository)
        => repository.DeprecatedProducts.FirstOrDefault(
            t => t.Sku.Equals(sku) &&
                t.Package.Equals(package));
}
