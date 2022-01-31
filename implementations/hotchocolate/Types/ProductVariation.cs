namespace Products;

public class ProductVariation
{
    public ProductVariation(string id)
    {
        Id = id;
    }

    [ID]
    public string Id { get; }
}
