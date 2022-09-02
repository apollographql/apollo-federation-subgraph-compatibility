import { stripIgnoredCharacters } from "graphql";
import { productsRequest } from "../utils/client";

describe("@key single", () => {
  test("applies single field @key on User", async () => {
    const serviceSDLQuery = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = serviceSDLQuery.data._service;
    const normalizedSDL = stripIgnoredCharacters(sdl);
    expect(normalizedSDL).toMatch(/type User(@extends|@federation__extends)?(@key|@federation__key)\(fields:"email"( resolvable:true)?\)/);
  });

  test("resolves single field @key on User", async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on User { email name }
        }
      }
    `,
      variables: {
        representations: [{ __typename: "User", email: "support@apollographql.com" }],
      },
    });

    expect(resp).toMatchObject({
      data: {
        _entities: [
          {
            email: "support@apollographql.com",
            name: "Jane Smith"
          },
        ],
      },
    });
  });
});

describe("@key multiple", () => {
  test("applies multiple field @key on DeprecatedProduct", async () => {
    const serviceSDLQuery = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = serviceSDLQuery.data._service;
    const normalizedSDL = stripIgnoredCharacters(sdl);
    expect(normalizedSDL).toMatch(/type DeprecatedProduct(@key|@federation__key)\(fields:"sku package"/);
  });

  test("resolves multiple field @key on DeprecatedProduct", async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on DeprecatedProduct { sku package reason }
        }
      }
    `,
      variables: {
        representations: [
          {
            __typename: "DeprecatedProduct",
            sku: "apollo-federation-v1",
            package: "@apollo/federation-v1",
          },
        ],
      },
    });

    expect(resp).toMatchObject({
      data: {
        _entities: [
          {
            sku: "apollo-federation-v1",
            package: "@apollo/federation-v1",
            reason: "Migrate to Federation V2"
          },
        ],
      },
    });
  });
});

describe("@key composite", () => {
  test("applies composite object @key on ProductResearch", async () => {
    const serviceSDLQuery = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = serviceSDLQuery.data._service;
    const normalizedSDL = stripIgnoredCharacters(sdl);
    expect(normalizedSDL).toMatch(/type ProductResearch(@key|@federation__key)\(fields:"study { caseNumber }"/);
  });

  test("resolves composite object @key on ProductResearch", async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on ProductResearch { study { caseNumber description } }
        }
      }
    `,
      variables: {
        representations: [
          {
            __typename: "ProductResearch",
            study: {
              caseNumber: "1234"
            }
          },
        ],
      },
    });

    expect(resp).toMatchObject({
      data: {
        _entities: [
          {
            study: {
              caseNumber: "1234",
              description: "Federation Study"
            }
          },
        ],
      },
    });
  });
});

describe("repeatable @key", () => {
  test("applies repeatable @key directive on Product", async () => {
    const serviceSDLQuery = await productsRequest({
      query: "query { _service { sdl } }",
    });

    const { sdl } = serviceSDLQuery.data._service;
    const normalizedSDL = stripIgnoredCharacters(sdl);
    expect(normalizedSDL).toMatch(/type Product.*(@key|@federation__key)\(fields:"id"( resolvable:true)?\).*\{/);
    // need to end regex with unique field in Product as otherwise we can match against DeprecatedProduct key
    expect(normalizedSDL).toMatch(/type Product.*(@key|@federation__key)\(fields:"sku package"( resolvable:true)?\).*variation/);
    expect(normalizedSDL).toMatch(/type Product.*(@key|@federation__key)\(fields:"sku variation { id }"( resolvable:true)?\).*\{/);
  });

  test("resolves multiple @key directives on Product", async () => {
    const entitiesQuery = await productsRequest({
      query: `#graphql
      query ($representations: [_Any!]!) {
        _entities(representations: $representations) {
          ...on Product { id sku }
        }
      }
    `,
      variables: {
        representations: [
          { 
            __typename: "Product",
            id: "apollo-federation"
          },
          {
            __typename: "Product",
            sku: "federation",
            package: "@apollo/federation"
          },
          {
            __typename: "Product",
            sku: "studio",
            variation: { id: "platform" }
          }
        ]
      }
    });

    expect(entitiesQuery).toMatchObject({
      data: {
        _entities: [
          {
            id: "apollo-federation",
            sku: "federation"
          },
          {
            id: "apollo-federation",
            sku: "federation"
          },
          {
            id: "apollo-studio",
            sku: "studio"
          }
        ]
      }
    });
  });
});