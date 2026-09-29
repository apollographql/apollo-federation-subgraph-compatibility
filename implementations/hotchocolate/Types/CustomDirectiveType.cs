using HotChocolate.ApolloFederation.Types;

namespace Products;

[Package("https://myspecs.dev/myCustomDirective/v1.0")]
public sealed class CustomDirectiveType : DirectiveType
{
    public const string CustomDirectiveName = "custom";

    protected override void Configure(IDirectiveTypeDescriptor descriptor)
        => descriptor
            .Name(CustomDirectiveName)
            .Location(DirectiveLocation.Object);
}
