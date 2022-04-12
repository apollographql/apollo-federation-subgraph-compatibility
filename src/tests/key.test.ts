import { productsRequest } from "../utils/client";

describe("@key single", () => {
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
});

describe("@key multiple", () => {
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

    console.log(resp);

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

describe("@key composite", () => {
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
