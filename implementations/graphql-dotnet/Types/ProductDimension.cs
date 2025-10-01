using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Shareable]
public class ProductDimension
{
    public ProductDimension(string size, float weight, string? unit)
    {
        Size = size;
        Weight = weight;
        Unit = unit;
    }

    public string? Size { get; }

    public float? Weight { get; }

    [Inaccessible]
    public string? Unit { get; }
}
