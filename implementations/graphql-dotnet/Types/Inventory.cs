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

    public List<DeprecatedProduct> DeprecatedProducts([FromServices] Data data) =>
        data.DeprecatedProducts.ToList();

    [FederationResolver]
    public static Inventory? ResolveById(string id, [FromServices] Data data) =>
        data.Inventories().FirstOrDefault(r => r.Id == id);
}
