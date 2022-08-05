package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.User;
import graphql.kickstart.tools.GraphQLResolver;
import org.springframework.stereotype.Component;

@Component
public class UserResolver implements GraphQLResolver<User> {

    public Integer getAverageProductsCreatedPerYear(User user) {
        if (user.getTotalProductsCreated() != null) {
            return Math.round(1.0f * user.getTotalProductsCreated() / user.getYearsOfEmployment());
        } else {
            return null;
        }
    }
}
