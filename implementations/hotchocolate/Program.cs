using HotChocolate.ApolloFederation.Types;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddSingleton<Data>();

builder.Services
    .AddGraphQLServer()
    .AddApolloFederation()
    .ExportDirective<CustomDirectiveType>()
    .AddType<Inventory>()
    .AddQueryType<Query>();

var app = builder.Build();

app.MapGraphQL("/");
app.RunWithGraphQLCommands(args);
