import fetch from "make-fetch-happen";

export const ROUTER_URL = "http://localhost:4000/";
const PING_QUERY = "query { __typename }";

const routerHealthCheck =
  "http://localhost:4000/.well-known/apollo/server-health";
const productsUrl = "http://localhost:4001/";

export async function graphqlRequest(
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

export function routerRequest(
  req: {
    query: string;
    variables?: { [key: string]: any };
    operationName?: string;
  },
  headers?: { [key: string]: any }
) {
  return graphqlRequest(ROUTER_URL, req, headers);
}

export function productsRequest(
  req: {
    query: string;
    variables?: { [key: string]: any };
    operationName?: string;
  },
  headers?: { [key: string]: any }
) {
  return graphqlRequest(productsUrl, req, headers);
}

export function routerRequest(
  req: {
    query: string;
    variables?: { [key: string]: any };
    operationName?: string;
  },
  headers?: { [key: string]: any }
) {
  return graphqlRequest(ROUTER_URL, req, headers);
}

export async function ping(): Promise<boolean> {
  const routerPing = await fetch(routerHealthCheck, { retry: 10 });

  if (!routerPing.ok) {
    console.log("router failed to start");
    return false;
  }

  let attempts = 100;
  let lastError = null;
  while (attempts--) {
    try {
      const implementationPing = await graphqlRequest(productsUrl, {
        query: PING_QUERY,
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
