import { productsRequest, graphqlRequest, ROUTER_URL } from "../utils/client";
import { compareSchemas } from "../utils/schemaComparison";
import { stripIgnoredCharacters } from "graphql";

describe("@inaccessible", () => {
  it("should return @inaccessible directives in _service sdl", async () => {
    const response = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = response.data._service;
    expect(stripIgnoredCharacters(sdl)).toContain("unit:String@inaccessible");

    expect(compareSchemas(response.data?._service?.sdl)).toBe(true);
  });

  it("should be able to query @inaccessible fields via the products schema directly", async () => {
    const resp = await productsRequest({
      query: `
        query GetProduct($id: ID!) {
          product(id: $id) {
            dimensions {
              unit
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
            unit: "kg",
          },
        },
      },
    });
  });
});
