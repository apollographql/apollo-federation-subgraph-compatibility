using GraphQL;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

public class CaseStudy
{
    [Id]
    public string CaseNumber { get; set; }

    public string? Description { get; set; }

}
