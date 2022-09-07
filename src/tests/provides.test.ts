import { productsRequest } from "../utils/client";

test("@provides", async () => {
  const resp = await productsRequest({
    query: `#graphql
      query ($id: ID!) {
        product(id: $id) {
          createdBy { email totalProductsCreated }
        }
      }`,
    variables: { id: "apollo-federation" },
  });

  expect(resp).not.toHaveProperty("errors");
  expect(resp).toMatchObject({
    data: {
      product: {
        createdBy: {
          email: "support@apollographql.com",
          totalProductsCreated: expect.any(Number),
        },
      },
    },
  });

  const totalProductsCreated: number =
    resp.data.product.createdBy.totalProductsCreated;
  expect(totalProductsCreated).not.toEqual(4);
});
