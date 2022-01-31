var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddSingleton<Data>();

builder.Services
    .AddGraphQLServer()
    .AddApolloFederation()
    .AddQueryType<Query>()
    .RegisterService<Data>();

var app = builder.Build();

app.MapGraphQL("/");

app.Run();
