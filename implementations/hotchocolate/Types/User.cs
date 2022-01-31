using HotChocolate.ApolloFederation;

namespace Products;

[Key("email")]
[ExtendServiceType]
public class User
{
    public User()
    {
    }

    public User(string email, int? totalProductsCreated)
    {
        Email = email;
        TotalProductsCreated = totalProductsCreated;
    }

    [ID]
    [External]
    public string Email { get; set; } = default!;

    [External]
    public int? TotalProductsCreated { get; set; }
}