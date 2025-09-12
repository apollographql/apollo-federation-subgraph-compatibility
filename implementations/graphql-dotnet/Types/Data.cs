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
        new()
        {
            Id = "apollo-federation",
            Sku = "federation",
            Package = "@apollo/federation",
            Variation = new ProductVariation { Id = "OSS" },
            Dimensions = Dimension,
            CreatedBy = DefaultUser,
            Research = [FederationStudy]
        },
        new()
        {
            Id = "apollo-studio",
            Sku = "studio",
            Package = string.Empty,
            Variation = new ProductVariation { Id = "platform" },
            Dimensions = Dimension,
            CreatedBy = DefaultUser,
            Research = [StudioStudy]
        }
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
