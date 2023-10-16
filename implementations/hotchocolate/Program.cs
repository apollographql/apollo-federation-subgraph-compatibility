var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddSingleton<Data>();

builder.Services
    .AddGraphQLServer()
    .AddApolloFederationV2(new CustomSchema())
    .AddType<CustomDirectiveType>()
    .AddType<Inventory>()
    .AddQueryType<Query>()
    .RegisterService<Data>();

var app = builder.Build();

app.MapGraphQL("/");
app.RunWithGraphQLCommands(args);
