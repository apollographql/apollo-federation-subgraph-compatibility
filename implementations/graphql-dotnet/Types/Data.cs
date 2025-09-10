namespace ApolloFederation.SubgraphCompatibility.Products.Types;

public class Data
{
    private static ProductDimension Dimension = new(size: "small", weight: 1, unit: "kg");
    private static User DefaultUser = new("support@apollographql.com", "Jane Smith");
    private static ProductResearch FederationStudy = new(new CaseStudy("1234", "Federation Study"), null);
    private static ProductResearch StudioStudy = new(new CaseStudy("1235", "Studio Study"), null);

    public List<User> Users { get; } =
    [
        DefaultUser
    ];

    public List<ProductResearch> ProductResearches { get; } =
    [
        FederationStudy,
        StudioStudy
    ];

    public List<Product> Products { get; } =
    [
        new("apollo-federation", "federation", "@apollo/federation", new ProductVariation("OSS"), Dimension, DefaultUser, null, [FederationStudy]),
        new("apollo-studio", "studio", string.Empty, new ProductVariation("platform"), Dimension, DefaultUser, null, [StudioStudy])
    ];

    public List<DeprecatedProduct> DeprecatedProducts { get; } =
    [
        new("apollo-federation-v1", "@apollo/federation-v1", "Migrate to Federation V2", DefaultUser)
    ];

    public List<Inventory> Inventories() =>
    [
        new("apollo-oss")
    ];
}
