using GraphQL;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

public class ProductVariation
{
    [Id]
    public required string Id { get; set;  }
}
