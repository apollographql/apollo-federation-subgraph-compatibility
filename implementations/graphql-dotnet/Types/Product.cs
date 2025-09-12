using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("id")]
[Key("sku package")]
[Key("sku variation { id }")]
[Directive("custom")]
public class Product
{
    [Id]
    public required string Id { get; set; }

    public string? Sku { get; set;}

    public string? Package { get; set;}

    public ProductVariation? Variation { get; set;}

    public ProductDimension? Dimensions { get; set;}

    [Provides("totalProductsCreated")]
    public User? CreatedBy { get; set; }

    [Directive("tag", "name", "internal")]
    public string? Notes { get; set; }

    public List<ProductResearch> Research { get; set; }

    [FederationResolver]
    public Product? GetProduct([FromServices] Data data)
    {
        if (Id != null)
        {
            return data.Products.FirstOrDefault(t => t.Id == Id);
        }

        if (Sku != null && Package != null)
        {
            return data.Products.FirstOrDefault(t => t.Sku == Sku && t.Package == Package);
        }

        if (Sku != null && Variation?.Id != null)
        {
            return data.Products.FirstOrDefault(t => t.Sku == Sku && t.Variation?.Id == Variation?.Id);
        }

        return null;
    }
}
