using GraphQL;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

public class CaseStudy
{

    public CaseStudy(string caseNumber, string? description)
    {
        CaseNumber = caseNumber;
        Description = description;
    }

    [Id]
    public string CaseNumber { get; }

    public string? Description { get; }

}
