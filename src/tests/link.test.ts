import { stripIgnoredCharacters } from "graphql";
import { productsRequest } from "../utils/client";
import { readFileSync } from "fs";
import { url } from "inspector";

test("@link", async () => {
  const response = await productsRequest({
    query: "query { _service { sdl } }",
  });

  expect(response.data).toMatchObject({
    _service: {
      sdl: expect.stringContaining("@link"),
    },
  });

  const { sdl } = response.data._service;
  console.log("sdl \n", sdl);
  // const sdl = readFileSync("/Users/dkuc/Development/apollo-federation-subgraph-compatibility/implementations/_template_library_/products.graphql", { encoding: "utf-8" })
  const normalizedSDL = stripIgnoredCharacters(sdl);

  const linksRegex = /@link\(([\s\S]+?)\)/g;
  // should have @link imports
  expect(linksRegex.test(normalizedSDL)).toBe(true);

  let fedLinkCount = 0;
  normalizedSDL.match(linksRegex).forEach(element => {
    console.log("processing link\n", element);
    const urlRegex = /url:(\".+?\")/;
    // skip definitions
    if (urlRegex.test(element)) {
      const linkUrl = JSON.parse(element.match(urlRegex)[1]);
      console.log("link url", linkUrl)
      const linkUrlSpecVersionRegex = /https:\/\/specs.apollo.dev\/federation\/v(.+)/;
      // only verify federation spec @links
      if (linkUrlSpecVersionRegex.test(linkUrl)) {
        console.log("fed import!");
        fedLinkCount++;
  
        const federationVersion = linkUrl.match(linkUrlSpecVersionRegex)[1];
        // only federation v2.0 and v2.1 are supported
        expect(federationVersion).toMatch(/2\.0|2\.1/);
  
        const linkImportsRegex = /import:\[(.+?)\]/;
        if (linkImportsRegex.test(element)) {
          // verify federation imports
          const expected = ["@composeDirective", "@extends", "@external", "@inaccessible", "@key", "@override", "@provides", "@requires", "@shareable", "@tag", "FieldSet"];
  
          const linkImportsMatch = element.match(linkImportsRegex);
          const linkImports = linkImportsMatch[1].split(" ");
          linkImports.forEach(importedElement => {
            console.log("import:", importedElement);
            if (!expected.includes(importedElement.replaceAll("\"", ""))) {
              expect('').toBe('unexpected federation import ${element}');
            }
          });
        }
      }
    }
  });

  if (fedLinkCount == 0) {
    expect('').toBe('missing federation spec @link imports');
  }

  if (fedLinkCount > 1) {
    expect('').toBe('schema @link imports multiple federation specs');
  }
});
