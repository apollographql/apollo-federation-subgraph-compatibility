package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.Map;

@ApplicationScoped
public class UserService {

  public Integer averageProductsCreatedPerYear(User user) {
    if (user.getTotalProductsCreated() != null) {
      return Math.round(1.0f * user.getTotalProductsCreated() / user.getYearsOfEmployment());
    } else {
      return null;
    }
  }

  public static User resolveByEmail(String email) {
    final User user = new User(email);

    return user;
  }

  public static User resolveForAverageProducts(String email, Integer totalProductsCreated, Integer yearsOfEmployment) {
    final User user = new User(email);
    user.setTotalProductsCreated(totalProductsCreated);
    user.setYearsOfEmployment(yearsOfEmployment);
    
    return user;
  }
}