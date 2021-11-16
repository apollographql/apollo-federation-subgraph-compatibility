using GraphQL.Server;
using GraphQL.Types;
using GraphQL.Utilities.Federation;
using Microsoft.Extensions.DependencyInjection;
using ApolloFederation.SubgraphCompatibility.Products;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(builder =>
        builder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod())
);


// Add GraphQL builder.Services and configure options
builder.Services
    .AddSingleton<Query>()
    .AddSingleton<AnyScalarGraphType>()
    .AddSingleton<ServiceGraphType>()
    .AddSingleton<ISchema>(provider =>
    {
        return FederatedSchema.For(File.ReadAllText("products.graphql"), schemaBuilder =>
        {
            schemaBuilder.ServiceProvider = provider;
            schemaBuilder.Types.Include<Query>();
            // reference resolvers
            schemaBuilder.Types.For(nameof(Product))
                .ResolveReferenceAsync<Product?>(ctx =>
                {
                    var productId = ctx.Arguments["id"]?.ToString();
                    if (!string.IsNullOrEmpty(productId))
                    {
                        return Task.FromResult<Product?>(Data.Products.FirstOrDefault(p => p.Id == productId));
                    }

                    return Task.FromResult<Product?>(null);
                });
        });
    })
    .AddGraphQL((options, provider) =>
    {
        var env = provider.GetRequiredService<IWebHostEnvironment>();
        options.EnableMetrics = env.IsDevelopment();
        var logger = provider.GetRequiredService<ILogger<ISchema>>();
        options.UnhandledExceptionDelegate = ctx => logger.LogError("{Error} occured", ctx.OriginalException.Message);
    })
    .AddSystemTextJson(deserializerSettings => { }, serializerSettings => { })
    .AddErrorInfoProvider((opt, provider) =>
    {
        var env = provider.GetRequiredService<IWebHostEnvironment>();
        opt.ExposeExceptionStackTrace = env.IsDevelopment();
    })
    .AddDataLoader();

var app = builder.Build();

app.UseCors();

app.UseRouting();

app.UseGraphQL<ISchema>("/");

app.Run();
