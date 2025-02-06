package org.acme.microprofile.graphql;
import io.smallrye.graphql.api.federation.Key;
import io.smallrye.graphql.api.federation.FieldSet;
import io.smallrye.graphql.api.federation.External;
import io.smallrye.graphql.api.federation.Override;
import org.eclipse.microprofile.graphql.NonNull;
import org.eclipse.microprofile.graphql.Id;

@Key(fields = @FieldSet("email"))
public class User {

    public static User DEFAULT_USER = new User("support@apollographql.com");
    @External @Id @NonNull
    private final String email;
    @Override(from = "users")
    private final String name;
    @External
    private Integer totalProductsCreated;
    @External
    private int yearsOfEmployment = -1;

    public User(String email) {
        this.email = email;
        this.name = "Jane Smith";
        this.totalProductsCreated = 1337;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public Integer getTotalProductsCreated() {
        return totalProductsCreated;
    }

    public void setTotalProductsCreated(Integer totalProductsCreated) {
        this.totalProductsCreated = totalProductsCreated;
    }

    public int getYearsOfEmployment() {
        return yearsOfEmployment;
    }

    public void setYearsOfEmployment(int yearsOfEmployment) {
        this.yearsOfEmployment = yearsOfEmployment;
    }
}
