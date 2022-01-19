using HotChocolate.ApolloFederation;

namespace Products;

[ForeignServiceTypeExtension]
public class Query
{
    public Product? GetProduct([ID] string id, Data repository)
        => repository.Products.FirstOrDefault(t => t.Id.Equals(id));
}
