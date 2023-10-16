using ApolloGraphQL.HotChocolate.Federation;
using ApolloGraphQL.HotChocolate.Federation.Two;

namespace Products;

[ComposeDirective("@custom")]
[Link("https://myspecs.dev/myCustomDirective/v1.0", new string[] { "@custom" })]
public class CustomSchema : FederatedSchema
{

}