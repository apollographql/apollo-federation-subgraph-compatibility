import { Resolver, ResolveField } from "@nestjs/graphql";

@Resolver("User")
export class UsersResolver {
  constructor() {}

  @ResolveField("name")
  getName() {
    return "Jane Smith";
  }
}
