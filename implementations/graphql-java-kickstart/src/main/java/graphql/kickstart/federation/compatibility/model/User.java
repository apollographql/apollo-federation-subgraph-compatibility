package graphql.kickstart.federation.compatibility.model;

import lombok.Getter;

@Getter
public class User {

    private final String email;
    private final String name;
    private final Integer totalProductsCreated;

    private int yearsOfEmployment = -1;

    public User(String email) {
        this.email = email;
        this.name = "Jane Smith";
        this.totalProductsCreated = 1337;
    }

    public void setYearsOfEmployment(int yearsOfEmployment) {
        this.yearsOfEmployment = yearsOfEmployment;
    }
}
