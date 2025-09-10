using GraphQL;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

public class ProductVariation
{
    public ProductVariation(string id)
    {
        Id = id;
    }

    [Id]
    public string Id { get; }
}
