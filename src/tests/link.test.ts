import { productsRequest } from "../utils/client";
import { compareSchemas } from "../utils/schemaComparison";

test("@link", async () => {
  const response = await productsRequest({
    query: "query { _service { sdl } }",
  });

  expect(response.data).toMatchObject({
    _service: {
      sdl: expect.stringContaining("@link"),
    },
  });

  expect(compareSchemas(response.data?._service?.sdl)).toBe(true);
});
