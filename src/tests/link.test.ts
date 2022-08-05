import { productsRequest } from "../utils/client";

test("@link", async () => {
  const response = await productsRequest({
    query: "query { _service { sdl } }",
  });

  expect(response.data).toMatchObject({
    _service: {
      sdl: expect.stringContaining("@link"),
    },
  });
});
