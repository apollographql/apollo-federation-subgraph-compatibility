namespace Products;

public class Data
{
    private static ProductDimension Dimension = new("small", 1, "kg");
    private static User DefaultUser = new("support@apollographql.com", "Jane Smith");
    private static ProductResearch FederationStudy = new(new CaseStudy("1234", "Federation Study"), null);
    private static ProductResearch StudioStudy = new(new CaseStudy("1235", "Studio Study"), null);

    public List<User> Users { get; } = new List<User> {
        DefaultUser
    };

    public List<ProductResearch> ProductResearches { get; } = new List<ProductResearch>
    {
        FederationStudy,
        StudioStudy
    };

    public List<Product> Products { get; } = new List<Product>
    {
        new("apollo-federation", "federation", "@apollo/federation", new ProductVariation("OSS"), Dimension, DefaultUser, null, new List<ProductResearch> { FederationStudy }),
        new("apollo-studio", "studio", string.Empty, new ProductVariation("platform"), Dimension, DefaultUser, null, new List<ProductResearch> { StudioStudy })
    };

    public List<DeprecatedProduct> DeprecatedProducts { get; } = new List<DeprecatedProduct>
    {
        new ("apollo-federation-v1", "@apollo/federation-v1", "Migrate to Federation V2", DefaultUser)
    };
}
