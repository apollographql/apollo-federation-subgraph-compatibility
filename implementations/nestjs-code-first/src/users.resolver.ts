import {
  Resolver,
  ResolveField,
  Parent,
  Directive,
  Int,
} from "@nestjs/graphql";

import { User } from "./user.model";
import { UsersService } from "./users.service";

@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @ResolveField()
  public name(@Parent() user: User) {
    return this.usersService.users[0].name;
  }

  @ResolveField("averageProductsCreatedPerYear", (returns) => Int, {
    nullable: true,
  })
  @Directive('@requires(fields: "totalProductsCreated yearsOfEmployment")')
  getAverageProductsCreatedPerYear({
    totalProductsCreated,
    yearsOfEmployment,
  }) {
    return totalProductsCreated
      ? Math.round(totalProductsCreated / yearsOfEmployment)
      : null;
  }
}
