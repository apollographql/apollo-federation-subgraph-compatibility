package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.User;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Component
public class UserReferenceResolver {

    public static User resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("email") instanceof String email) {
            final User user = new User(email);
            if (reference.get("yearsOfEmployment") instanceof Integer yearsOfEmployment) {
                user.setYearsOfEmployment(yearsOfEmployment);
            }
            return user;
        }

        return null;
    }
}
