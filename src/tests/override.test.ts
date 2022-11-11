import { productsRequest, routerRequest } from "../utils/client";
import { stripIgnoredCharacters } from "graphql";

describe("@override", () => {
  it("should return @override directives in _service sdl", async () => {
    const response = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = response.data._service;
    expect(stripIgnoredCharacters(sdl)).toMatch(/(@override|@federation__override)\(from:"users"\)/);
  });

  it("should return overridden user name", async () => {
    const resp = await routerRequest({
      query: `
        query GetProduct($id: ID!) {
          product(id: $id) {
            createdBy {
              name
            }
          }
        }
      `,
      variables: { id: "apollo-federation" },
    });

    expect(resp).not.toHaveProperty("errors");
    expect(resp).toMatchObject({
      data: {
        product: {
          createdBy: {
            name: "Jane Smith",
          },
        },
      },
    });
  });
});
