using ApolloGraphQL.HotChocolate.Federation;

namespace Products;

[Key("id")]
[Key("sku package")]
[Key("sku variation { id }")]
[Custom]
public class Product
{
    public Product(string id, string? sku, string? package, ProductVariation? variation, ProductDimension? dimensions, User? createdBy, string? notes, List<ProductResearch> research)
    {
        Id = id;
        Sku = sku;
        Package = package;
        Variation = variation;
        Dimensions = dimensions;
        CreatedBy = createdBy;
        Notes = notes;
        Research = research;
    }

    [ID]
    public string Id { get; }

    public string? Sku { get; }

    public string? Package { get; }

    public ProductVariation? Variation { get; }

    public ProductDimension? Dimensions { get; }

    [Provides("totalProductsCreated")]
    public User? CreatedBy { get; }

    [ApolloTag("internal")]
    public string? Notes { get; }

    public List<ProductResearch> Research { get; }

    [ReferenceResolver]
    public static Product? GetProductById(
        string id,
        Data repository)
        => repository.Products.FirstOrDefault(t => t.Id.Equals(id));

    [ReferenceResolver]
    public static Product? GetProductByPackage(
        string sku,
        string package,
        Data repository)
        => repository.Products.FirstOrDefault(
            t => (t.Sku?.Equals(sku) ?? false) &&
                (t.Package?.Equals(package) ?? false));

    [ReferenceResolver]
    public static Product? GetProductByVariation(
        string sku,
        [Map("variation.id")] string variationId,
        Data repository)
        => repository.Products.FirstOrDefault(
            t => (t.Sku?.Equals(sku) ?? false) &&
                (t.Variation?.Id.Equals(variationId) ?? false));
}
