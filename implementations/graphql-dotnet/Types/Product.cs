using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("id")]
[Key("sku package")]
[Key("sku variation { id }")]
[Directive("custom")]
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

    [Id]
    public string Id { get; }

    public string? Sku { get; }

    public string? Package { get; }

    public ProductVariation? Variation { get; }

    public ProductDimension? Dimensions { get; }

    [Provides("totalProductsCreated")]
    public User? CreatedBy { get; }

    [Directive("tag", "name", "internal")]
    public string? Notes { get; }

    public List<ProductResearch> Research { get; }

    [FederationResolver]
    public Product? GetProductByVariation([FromServices] Data repository)
    {
        if (Id != null)
        {
            return repository.Products.FirstOrDefault(t => t.Id == Id);
        }

        if (Sku != null && Package != null)
        {
            return repository.Products.FirstOrDefault(t => t.Sku == Sku && t.Package == Package);
        }

        if (Sku != null && Variation?.Id != null)
        {
            return repository.Products.FirstOrDefault(t => t.Sku == Sku && t.Variation?.Id == Variation?.Id);
        }

        return null;
    }
}
