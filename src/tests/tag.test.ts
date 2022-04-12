import { productsRequest } from "../utils/client";
import { compareSchemas } from "../utils/schemaComparison";
import { stripIgnoredCharacters } from "graphql";

test("@tag", async () => {
  const response = await productsRequest({
    query: "query { _service { sdl } }",
  });

  const { sdl } = response.data._service;
  expect(stripIgnoredCharacters(sdl)).toContain('@tag(name:"internal")');

  expect(compareSchemas(response.data?._service?.sdl)).toBe(true);
});
