package com.netflix.graphql.dgs.compatibility.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsData;
import com.netflix.graphql.dgs.DgsDataFetchingEnvironment;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.compatibility.model.User;
import java.util.Map;
import org.jetbrains.annotations.NotNull;

@DgsComponent
public class UserDataFetcher {

  @DgsData(parentType = "User", field = "averageProductsCreatedPerYear")
  public Integer averageProductsCreatedPerYear(DgsDataFetchingEnvironment dfe) {
    User user = dfe.getSource();
    if (user.getTotalProductsCreated() != null) {
      return Math.round(1.0f * user.getTotalProductsCreated() / user.getYearsOfEmployment());
    } else {
      return null;
    }
  }

  @DgsEntityFetcher(name = "User")
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