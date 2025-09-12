using ApolloFederation.SubgraphCompatibility.Products.Types;
using GraphQL;
using GraphQL.Types;
using GraphQLParser.AST;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddSingleton<Query>()
    .AddSingleton<Data>()
    .AddGraphQL(b => b
        .AddSystemTextJson()
        .AddAutoSchema<Query>()
        .AddFederation("2.3", link =>
        {
            link.Imports.Add("@interfaceObject", "@interfaceObject");
            link.Imports.Add("@composeDirective", "@composeDirective");
            link.Imports.Add("@extends", "@extends");
        })
        .ConfigureSchema(schema =>
        {
            schema.Directives.Register(new Directive("custom", DirectiveLocation.Object));
            schema.LinkSchema("https://myspecs.dev/myCustomDirective/v1.0", link => link.Imports.Add("@custom", "@custom"));
            schema.ApplyDirective("composeDirective", "name", "@custom");
        })
        .ConfigureExecutionOptions(options => options.ThrowOnUnhandledException = true));

var app = builder.Build();

app.UseRouting();
app.UseGraphQL("/");

app.Run();
