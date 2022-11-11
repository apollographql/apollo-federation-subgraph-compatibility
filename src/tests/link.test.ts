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

  const { sdl } = response.data._service;

  const linksRegex = /@link\(([\s\S]+?)\)/g;
  // should have @link imports
  expect(linksRegex.test(sdl)).toBe(true);

  let fedLinkCount = 0;
  sdl.match(linksRegex).forEach(element => {
    const linkUrlSpecVersionRegex = /url\s*:\s*"https:\/\/specs.apollo.dev\/federation\/v(.+?)"/;
    // only verify federation spec @links
    if (linkUrlSpecVersionRegex.test(element)) {
      fedLinkCount++;

      const federationVersion = element.match(linkUrlSpecVersionRegex)[1];
      // only federation v2.0 and v2.1 are supported
      expect(federationVersion).toMatch(/2\.0|2\.1/);

      const linkImportsRegex = /import\s*:\s*(\[.+?\])/;
      if (linkImportsRegex.test(sdl)) {
        // verify federation imports
        const expected = ["@composeDirective", "@extends", "@external", "@inaccessible", "@key", "@override", "@provides", "@requires", "@shareable", "@tag", "FieldSet"];

        const linkImportsMatch = sdl.match(linkImportsRegex);
        const linkImports = JSON.parse(linkImportsMatch[1]);
        linkImports.forEach(importedElement => {
          if (!expected.includes(importedElement)) {
            expect('').toBe('unexpected federation import ${element}');
          }
        });
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
