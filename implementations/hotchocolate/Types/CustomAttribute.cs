using HotChocolate.Types.Descriptors;

namespace Products;

public sealed class CustomAttribute : ObjectTypeDescriptorAttribute
{
    protected override void OnConfigure(IDescriptorContext context, IObjectTypeDescriptor descriptor, Type type)
    {
        descriptor.Directive(CustomDirectiveType.CustomDirectiveName);
    }
}