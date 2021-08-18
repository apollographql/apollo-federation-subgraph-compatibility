import { productsRequest } from "../utils/client";

test("@requires", async () => {
  const resp = await productsRequest({
    query: `#graphql
      query ($id: ID!) {
        product(id: $id) { dimensions { size weight } }
      }`,
    variables: { id: "apollo-federation" },
  });

  expect(resp).toMatchObject({
    data: {
      product: {
        dimensions: {
          size: "1",
          weight: 1,
        },
      },
    },
  });
});
