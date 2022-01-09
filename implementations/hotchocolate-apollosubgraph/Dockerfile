FROM mcr.microsoft.com/dotnet/sdk:6.0 as build
WORKDIR /source
COPY ./ ./
RUN dotnet publish -c release -o /app
FROM mcr.microsoft.com/dotnet/aspnet:6.0
WORKDIR /app
COPY --from=build /app ./
EXPOSE 4001
ENTRYPOINT ["dotnet", "products.dll", "--urls", "http://*:4001"]
