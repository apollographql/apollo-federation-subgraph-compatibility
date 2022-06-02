package graphql.kickstart.federation.compatibility.model;

import lombok.Getter;

@Getter
public class User {

    private final String email;
    private final Integer totalProductsCreated;
    private final String name;

    public User(String email) {
        this.email = email;
        this.totalProductsCreated = 1337;
        this.name = "Jane Smith";
    }

}
