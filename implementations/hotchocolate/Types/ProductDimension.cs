namespace Products;

public class ProductDimension
{
    public ProductDimension(string size, double weight, string? unit)
    {
        Size = size;
        Weight = weight;
        Unit = unit;
    }

    public string? Size { get; }

    public double? Weight { get; }

    public string? Unit { get; }
}
