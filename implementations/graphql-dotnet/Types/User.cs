using GraphQL;
using GraphQL.Federation;

namespace ApolloFederation.SubgraphCompatibility.Products.Types;

[Key("email")]
public class User
{
    public User(string email, string? name)
    {
        Email = email;
        Name = name;
    }

    [Requires("totalProductsCreated yearsOfEmployment")]
    public int? AverageProductsCreatedPerYear()
    {
        if (TotalProductsCreated != null && LengthOfEmployment != null)
        {
            return Convert.ToInt32((TotalProductsCreated * 1.0) / LengthOfEmployment);
        }
        return null;
    }

    [Id]
    [External]
    public string Email { get; set; }

    [Override("users")]
    public string? Name { get; }

    [External]
    public int? TotalProductsCreated { get; set; } = 1337;

    [Ignore]
    public int? LengthOfEmployment { get; set; }

    [External]
    public int YearsOfEmployment()
    {
        if (LengthOfEmployment == null)
        {
            throw new InvalidOperationException("yearsOfEmployment should never be null - it should be populated by _entities query");
        }

        return (int)LengthOfEmployment;
    }

    [FederationResolver]
    public static User? GetUserByEmail([FromServices] Data repository, string email, int? totalProductsCreated, int? yearsOfEmployment)
    {
        var user = repository.Users.FirstOrDefault(u => u.Email == email);
        if (user != null)
        {
            if (totalProductsCreated != null)
            {
                user.TotalProductsCreated = totalProductsCreated;
            }

            if (yearsOfEmployment != null)
            {
                user.LengthOfEmployment = yearsOfEmployment;
            }
        }
        return user;
    }
}
