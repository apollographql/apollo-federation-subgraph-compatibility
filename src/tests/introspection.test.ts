import { productsRequest } from "../utils/client";
import { compareSchemas } from "../utils/schemaComparison";

test("introspection", async () => {
  const productsPing = await productsRequest({
    query: "query { _service { sdl } }",
  });

  expect(productsPing.data).toMatchObject({
    _service: {
      sdl: expect.stringContaining("type Query"),
    },
  });

  const basicallyTheSame = compareSchemas(productsPing.data?._service?.sdl);

  expect(basicallyTheSame).toBe(true);
});
