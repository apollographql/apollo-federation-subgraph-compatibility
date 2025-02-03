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

  public static User resolveReference(Map<String, Object> reference) {
    if (reference.get("email") instanceof String email) {
      final User user = new User(email);
      if (reference.get("totalProductsCreated") instanceof Integer totalProductsCreated) {
        user.setTotalProductsCreated(totalProductsCreated);
      }
      if (reference.get("yearsOfEmployment") instanceof Integer yearsOfEmployment) {
        user.setYearsOfEmployment(yearsOfEmployment);
      }
      return user;
    }

    return null;
  }
}