import { productsRequest, graphqlRequest, ROUTER_URL } from "../utils/client";
import { compareSchemas } from "../utils/schemaComparison";
import { stripIgnoredCharacters } from "graphql";

describe("@shareable", () => {
  it("should return @shareable directives in _service sdl", async () => {
    const response = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = response.data._service;
    expect(stripIgnoredCharacters(sdl)).toContain(
      "type ProductDimension@shareable"
    );

    expect(compareSchemas(response.data?._service?.sdl)).toBe(true);
  });

  it("should be able to resolve @shareable ProductDimension types", async () => {
    const resp = await graphqlRequest(ROUTER_URL, {
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
