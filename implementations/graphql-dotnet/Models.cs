namespace ApolloFederation.SubgraphCompatibility.Products;

public record ProductDimension(string? Size, float? Weight);
public record ProductVariation(string Id);
public record User(string Email, int? TotalProductsCreated);
public record Product(string Id, string? Sku, string? Package, ProductVariation? Variation, ProductDimension? Dimensions, User? CreatedBy);

public static class Data
{
	public static ProductDimension Dimension = new ProductDimension("small", 1);
	public static User CreatedBy = new User("support@apollographql.com", 1337);
	public static IReadOnlyList<Product> Products = new List<Product>
	{
		new Product("apollo-federation", "federation", "@apollo/federation", new ProductVariation("OSS"), Dimension, CreatedBy),
		new Product("apollo-studio", "sku", "", new ProductVariation("platform"), Dimension, CreatedBy)
	};
}
