using ApolloGraphQL.HotChocolate.Federation;

namespace Products;

[Shareable]
public class ProductDimension
{
    public ProductDimension(string size, double weight, string? unit)
    {
        Size = size;
        Weight = weight;
        Unit = unit;
    }

    public string? Size { get; }

    public double? Weight { get; }

    [Inaccessible]
    public string? Unit { get; }
}
