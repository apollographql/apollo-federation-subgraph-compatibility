import { readFileSync } from "fs";
import { print, parse } from "graphql";
import { resolve } from "path";
import fetch from "make-fetch-happen";

const pingQuery = "query { __typename }";

const routerHealthCheck =
  "http://localhost:4000/.well-known/apollo/server-health";

const productsUrl = "http://localhost:4001";

async function graphqlRequest(
  url: string,
  req: {
    query: string;
    variables?: { [key: string]: any };
    operationName?: string;
  },
  headers?: { [key: string]: any }
) {
  const resp = await fetch(url, {
    headers: { "content-type": "application/json", ...(headers ?? {}) },
    method: "POST",
    body: JSON.stringify(req),
  });

  if (
    resp.ok &&
    resp.headers.get("content-type")?.startsWith("application/json")
  ) {
    return resp.json();
  }

  return resp.text();
}

export class GraphClient {
  static instance: GraphClient;

  static init() {
    if (GraphClient.instance)
      throw new Error("Only one instance of GraphClient can exist");
    GraphClient.instance = new GraphClient();
  }

  async pingSources(): Promise<boolean> {
    const routerPing = await fetch(routerHealthCheck, { retry: 10 });

    if (!routerPing.ok) {
      console.log("router failed to start");
      return false;
    }

    let attempts = 10;
    let lastError = null;
    while (attempts--) {
      try {
        const implementationPing = await graphqlRequest(productsUrl, {
          query: pingQuery,
        });

        if (implementationPing.data?.__typename) {
          return true;
        } else {
          lastError = implementationPing.errors;
        }
      } catch (e) {
        lastError = e;
      }

      await new Promise((r) => setTimeout(r, 1000));
    }

    console.log("implementation under test failed to start");
    console.log(lastError);
    return false;
  }

  async check_service(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(productsUrl, {
        query: "query { _service { sdl } }",
      });
      const productsRaw = readFileSync(
        resolve(
          __dirname,
          "..",
          "..",
          "implementations",
          "_template_",
          "products.graphql"
        ),
        "utf-8"
      );

      if (!productsPing.data?._service?.sdl) return false;

      const implementingLibrarySchema = parse(productsPing.data._service.sdl);
      const productsReferenceSchema = parse(productsRaw);

      const implementingLibraryTest = print(implementingLibrarySchema);
      const referenceSchema = print(productsReferenceSchema);

      if (implementingLibraryTest == referenceSchema) return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async check_ftv1(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(
        productsUrl,
        { query: pingQuery },
        { "apollo-federation-include-trace": "ftv1" }
      );

      if (productsPing.extensions.ftv1) return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async check_key_single(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(productsUrl, {
        query:
          "query ($representations: [_Any!]!){_entities(representations: $representations) {...on Product {sku}}}",
        variables: {
          representations: [{ __typename: "Product", id: "apollo-federation" }],
        },
      });

      if (productsPing.data._entities[0].sku == "federation") return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async check_key_multiple(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(productsUrl, {
        query:
          "query ($representations: [_Any!]!){_entities(representations: $representations) {...on Product {id}}}",
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

      if (productsPing.data._entities[0]?.id == "apollo-federation")
        return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async check_key_composite(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(productsUrl, {
        query:
          "query ($representations: [_Any!]!){_entities(representations: $representations) {...on Product {id}}}",
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

      if (productsPing.data._entities[0]?.id == "apollo-federation")
        return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async check_requires(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(productsUrl, {
        query:
          "query ($id: ID!){ product(id: $id) { dimensions { size weight } } }",
        variables: { id: "apollo-federation" },
      });

      if (
        productsPing.data?.product?.dimensions?.size == "1" &&
        productsPing.data?.product?.dimensions?.weight == 1
      )
        return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  async check_provides(): Promise<boolean> {
    try {
      const productsPing = await graphqlRequest(productsUrl, {
        query:
          "query ($id: ID!){ product(id: $id) { createdBy { email totalProductsCreated } } }",
        variables: { id: "apollo-federation" },
      });

      if (productsPing.data?.product?.createdBy?.totalProductsCreated !== 4)
        return true;

      return false;
    } catch (err) {
      console.log(err);
      return false;
    }
  }
}
