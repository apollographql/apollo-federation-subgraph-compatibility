using GraphQL;

namespace ApolloFederation.SubgraphCompatibility.Products;

[GraphQLMetadata("Query")]
public class Query
{
	[GraphQLMetadata("product")]
	public static Task<Product?> GetProductById(string Id)
	{
		return Task.FromResult(Data.Products.FirstOrDefault(p => p.Id == Id));
	}
}
