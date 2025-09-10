using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("study { caseNumber }")]
public class ProductResearch
{

    public ProductResearch(CaseStudy study, string? outcome)
    {
        Study = study;
        Outcome = outcome;
    }

    public CaseStudy Study { get; }

    public string? Outcome { get; }

    [FederationResolver]
    public ProductResearch? GetProductResearchByCaseNumber([FromServices] Data repository) =>
        repository.ProductResearches.FirstOrDefault(r => r.Study.CaseNumber == Study.CaseNumber);
}
