import { productsRequest, routerRequest } from "../utils/client";
import { stripIgnoredCharacters } from "graphql";

describe("@shareable", () => {
  it("should return @shareable directives in _service sdl", async () => {
    const response = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = response.data._service;
    expect(stripIgnoredCharacters(sdl)).toMatch(/type ProductDimension(@shareable|@federation__shareable)/);
  });

  it("should be able to resolve @shareable ProductDimension types", async () => {
    const resp = await routerRequest({
      query: `
        query GetProduct($id: ID!) {
          product(id: $id) {
            dimensions {
              size
              weight
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
          dimensions: {
            size: "small",
            weight: 1,
          },
        },
      },
    });
  });
});
