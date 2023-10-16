using ApolloGraphQL.HotChocolate.Federation;

namespace Products;

[Key("email")]
[Extends]
public class User
{
    public User(string email, string? name)
    {
        Email = email;
        Name = name;
    }

    [Requires("totalProductsCreated yearsOfEmployment")]
    public int? GetAverageProductsCreatedPerYear()
    {
        if (TotalProductsCreated != null && LengthOfEmployment != null)
        {
            return Convert.ToInt32((TotalProductsCreated * 1.0) / LengthOfEmployment);
        }
        return null;
    }

    [ID]
    [External]
    public string Email { get; set; }

    [Override("users")]
    public string? Name { get; }

    [External]
    public int? TotalProductsCreated { get; set; } = 1337;

    [GraphQLIgnore]
    public int? LengthOfEmployment { get; set; }

    [External]
    public int GetYearsOfEmployment()
    {
        if (LengthOfEmployment == null)
        {
            throw new InvalidOperationException("yearsOfEmployment should never be null - it should be populated by _entities query");
        }

        return (int)LengthOfEmployment;
    }

    [ReferenceResolver]
    public static User? GetUserByEmail(
        string email,
        int? totalProductsCreated,
        int? yearsOfEmployment,
        Data repository)
    {
        User? user = repository.Users.FirstOrDefault(u => u.Email.Equals(email));
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
