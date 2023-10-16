namespace Products;

public sealed class CustomDirectiveType : DirectiveType
{
    public const string CustomDirectiveName = "custom";

    protected override void Configure(IDirectiveTypeDescriptor descriptor)
        => descriptor
            .Name(CustomDirectiveName)
            .Location(DirectiveLocation.Object);
}