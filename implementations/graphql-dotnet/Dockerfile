FROM mcr.microsoft.com/dotnet/sdk:6.0 as build
WORKDIR /app

COPY . .
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/aspnet:6.0

WORKDIR /app

COPY --from=build /app/out .

ENV ASPNETCORE_URLS=http://+:4001

ENTRYPOINT ["dotnet", "ApolloFederation.SubgraphCompatibility.Products.dll"]
