using ApolloFederation.SubgraphCompatibility.Products.Types;
using GraphQL;
using GraphQL.Federation.Types;
using GraphQL.Types;
using GraphQLParser.AST;
using GraphQLParser.Visitors;
using ServiceLifetime = GraphQL.DI.ServiceLifetime;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options =>
    options.AddDefaultPolicy(policyBuilder =>
        policyBuilder.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod())
);

builder.Services
    .AddSingleton<Query>()
    .AddGraphQL(b => b
        .AddSystemTextJson()
        .AddAutoSchema<Query>()
        .AddFederation("2.3", link =>
        {
            link.Imports.Add("@interfaceObject", "@interfaceObject");
            link.Imports.Add("@composeDirective", "@composeDirective");
        })
        .ConfigureSchema(schema =>
        {
            schema.Directives.Register(new Directive("custom", DirectiveLocation.Object));
            schema.LinkSchema("https://myspecs.dev/myCustomDirective/v1.0", link => link.Imports.Add("@custom", "@custom"));
            schema.ApplyDirective("composeDirective", "name", "@custom");
        })
        .ConfigureExecutionOptions(options => options.ThrowOnUnhandledException = true)
        .Services.Register<Data>(ServiceLifetime.Singleton));

var app = builder.Build();

app.MapGet("/print", context =>
{
    var schema = context.RequestServices.GetRequiredService<ISchema>().Print(new FederationPrintOptions
    {
        ArgumentsPrintMode = SDLPrinterArgumentsMode.ForceNewLine,
        IncludeImportedDefinitions = false,
    });
    context.Response.WriteAsync(schema);
    return Task.CompletedTask;
});

app.UseCors();
app.UseRouting();
app.UseGraphQL("/");

app.Run();
