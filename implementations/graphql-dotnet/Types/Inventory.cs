using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("id")]
[Directive("interfaceObject")]
public class Inventory
{
    public Inventory(string id)
    {
        Id = id;
    }

    [Id]
    public string Id { get; }

    public List<DeprecatedProduct> DeprecatedProducts([FromServices] Data repo) =>
        repo.DeprecatedProducts.ToList();

    [FederationResolver]
    public static Inventory? GetInventoryById(string id, [FromServices] Data repo) =>
        repo.Inventories().FirstOrDefault(r => r.Id == id);
}
