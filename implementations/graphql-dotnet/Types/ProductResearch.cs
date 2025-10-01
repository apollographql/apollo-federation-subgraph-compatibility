using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("study { caseNumber }")]
public class ProductResearch
{
    public CaseStudy Study { get; set; }

    public string? Outcome { get; set; }

    [FederationResolver]
    public ProductResearch? Resolve([FromServices] Data data) =>
        data.ProductResearches.FirstOrDefault(r => r.Study.CaseNumber == Study.CaseNumber);
}
