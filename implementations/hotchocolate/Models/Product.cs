using HotChocolate.ApolloFederation;
using HotChocolate.Language;

namespace Products;

[Key("id")]
[Key("sku package")]
[Key("sku variation { id }")]
[ReferenceResolver(EntityResolver = nameof(ResolveReference))]
public class Product
{
    public Product(string id, string sku, string package, string variation)
    {
        Id = id;
        Sku = sku;
        Package = package;
        Variation = new(variation);
    }

    [ID]
    public string Id { get; }

    public string? Sku { get; }

    public string? Package { get; }

    public ProductVariation? Variation { get; }

    public ProductDimension? Dimensions { get; } = new("1", 1);

    [Provides("totalProductsCreated")]
    public User? CreatedBy { get; } = new("support@apollographql.com", 1337);

    public static Product? ResolveReference(
        [LocalState] ObjectValueNode data,
        Data repository)
    {
        var map = data.Fields.ToDictionary(t => t.Name.Value, t => t.Value);

        if (map.TryGetValue("id", out IValueNode? idValue) && 
            idValue is StringValueNode id)
        {
            return repository.Products.FirstOrDefault(t => t.Id.Equals(idValue.Value));
        }
        else if (map.TryGetValue("sku", out IValueNode? skuValue) &&
            map.TryGetValue("package", out IValueNode? packageValue) &&
            skuValue is StringValueNode sku &&
            packageValue is StringValueNode package)
        {
            return repository.Products.FirstOrDefault(
                t => (t.Sku?.Equals(sku.Value) ?? false) && 
                    (t.Package?.Equals(package.Value) ?? false));
        }
        else if (map.TryGetValue("sku", out skuValue) &&
            map.TryGetValue("variation", out IValueNode? variationValue) &&
            skuValue is StringValueNode sku2 &&
            variationValue is ObjectValueNode variation &&
            variation.Fields[0].Value is StringValueNode id2)
        {
            return repository.Products.FirstOrDefault(
                t => (t.Sku?.Equals(sku2.Value) ?? false) && 
                    (t.Variation?.Id.Equals(id2.Value) ?? false));
        }

        return null;
    }
}
