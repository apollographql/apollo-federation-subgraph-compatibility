using HotChocolate.Extensions.ApolloSubgraph;

var builder = WebApplication.CreateBuilder(args);
builder.Services
    .AddSingleton<ProductsRepository>()
    .AddGraphQLServer()
    .AddApolloSubgraph()
    .AddDocumentFromFile("products.graphql")
    .BindRuntimeType<Product>()
    .BindRuntimeType<ProductDimension>()
    .BindRuntimeType<ProductVariation>()
    .BindRuntimeType<Query>()
    .BindRuntimeType<User>();

var app = builder.Build();
app.UseRouting().UseEndpoints(x => x.MapGraphQL(path: "/"));
app.Run();

internal sealed class ProductsRepository
{
    private static readonly Product[] s_products =
    {
        new(
            Id: "apollo-federation",
            Sku: "federation",
            Package: "@apollo/federation",
            Variation: new ProductVariation("OSS"),
            Dimensions: new ProductDimension(Size: "1", Weight: 1),
            CreatedBy: new User("support@apollographql.com", TotalProductsCreated: 1991)),
        new(
            Id: "apollo-studio",
            Sku: "studio",
            Package: string.Empty,
            Variation: new ProductVariation("platform"),
            Dimensions: new ProductDimension(Size: "1", Weight: 1),
            CreatedBy: new User("support@apollographql.com", TotalProductsCreated: 1991)),
    };

    public Product? Find(
        string? id = null,
        string? sku = null,
        string? package = null,
        string? variation = null)
    {
        var query = s_products.AsEnumerable();
        if (id != null)
        {
            query = query.Where(x => x.Id == id);
        }
        if (sku != null)
        {
            query = query.Where(x => x.Sku == sku);
        }
        if (package != null)
        {
            query = query.Where(x => x.Package == package);
        }
        if (variation != null)
        {
            query = query.Where(x => x.Variation.Id == variation);
        }
        return query.SingleOrDefault();
    }
}

internal sealed class Query
{
    public Product? GetProduct([Service] ProductsRepository products, string id)
    {
        return products.Find(id);
    }
}

internal sealed record Product(
    string Id,
    string Sku,
    string Package,
    ProductVariation Variation,
    ProductDimension Dimensions,
    User CreatedBy)
{
    public static Product? ResolveEntity(IEntityResolverContext ctx)
    {
        var products = ctx.Service<ProductsRepository>();

        var id = ctx.Representation.GetValueOrDefault<string>("id");
        if (id != null)
        {
            return products.Find(id);
        }

        var sku = ctx.Representation.GetValueOrDefault<string>("sku");
        var package = ctx.Representation.GetValueOrDefault<string>("package");
        if (sku != null && package != null)
        {
            return products.Find(sku: sku, package: package);
        }

        var variation = ctx.Representation
            .GetValueOrDefault<IReadOnlyDictionary<string, object?>>("variation")?
            .GetValueOrDefault<string>("id");
        if (sku != null && variation != null)
        {
            return products.Find(sku: sku, variation: variation);
        }

        return null;
    }
}

internal sealed record ProductDimension(string Size, double Weight);

internal sealed record ProductVariation(string Id);

internal sealed record User(string Email, int TotalProductsCreated);