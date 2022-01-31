namespace Products;

public class Data
{
    public List<Product> Products { get; } = new List<Product>
    {
        new("apollo-federation", "federation", "@apollo/federation", "OSS"),
        new("apollo-studio", "studio", string.Empty, "platform")
    };
}
