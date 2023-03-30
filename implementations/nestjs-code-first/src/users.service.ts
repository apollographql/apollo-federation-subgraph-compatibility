import { Injectable } from "@nestjs/common";

import { User } from "./user.model";

@Injectable()
export class UsersService {
  public users: User[] = [
    {
      name: "Jane Smith",
      email: "support@apollographql.com",
      totalProductsCreated: 1337,
      yearsOfEmployment: 0,
    },
  ];
}
