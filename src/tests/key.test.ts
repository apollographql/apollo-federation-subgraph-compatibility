import { productsRequest } from "../utils/client";

describe("@key", () => {
  test("single", async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on Product { sku }
        }
      }
    `,
      variables: {
        representations: [{ __typename: "Product", id: "apollo-federation" }],
      },
    });

    expect(resp).toMatchObject({
      data: {
        _entities: [
          {
            sku: "federation",
          },
        ],
      },
    });
  });

  test("multiple", async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on Product { id }
        }
      }
    `,
      variables: {
        representations: [
          {
            __typename: "Product",
            sku: "federation",
            package: "@apollo/federation",
          },
        ],
      },
    });

    expect(resp).toMatchObject({
      data: {
        _entities: [
          {
            id: "apollo-federation",
          },
        ],
      },
    });
  });

  test("composite", async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on Product { id }
        }
      }
    `,
      variables: {
        representations: [
          {
            __typename: "Product",
            sku: "federation",
            variation: { id: "OSS" },
          },
        ],
      },
    });

    expect(resp).toMatchObject({
      data: {
        _entities: [
          {
            id: "apollo-federation",
          },
        ],
      },
    });
  });
});
