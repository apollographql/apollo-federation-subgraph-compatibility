import { stripIgnoredCharacters } from 'graphql';
import { productsRequest } from '../utils/client';

test('@composeDirective', async () => {
  const serviceSDLQuery = await productsRequest({
    query: 'query { _service { sdl } }',
  });

  const { sdl } = serviceSDLQuery.data._service;
  const normalizedSDL = stripIgnoredCharacters(sdl);

  // schema contains @link import of new composed directive
  const linksRegex = /@link\(([\s\S]+?)\)/g;
  expect(linksRegex.test(normalizedSDL)).toBe(true);
  normalizedSDL.match(linksRegex).forEach((element) => {
    const urlRegex = /url:(\".+?\")/;
    if (urlRegex.test(element)) {
      const linkUrl = JSON.parse(element.match(urlRegex)[1]);
      const linkUrlSpecVersionRegex =
        /https:\/\/myspecs.dev\/myCustomDirective\/v(.+)/;
      // only verify @composeDirective spec @links
      if (linkUrlSpecVersionRegex.test(linkUrl)) {
        const linkImportsRegex = /import:\[(.+?)\]/;
        if (linkImportsRegex.test(element)) {
          // verify federation imports
          const expected = ['@custom'];

          const linkImportsMatch = element.match(linkImportsRegex);
          const linkImports = linkImportsMatch[1].split(' ');
          linkImports.forEach((importedElement) => {
            if (!expected.includes(importedElement.replaceAll('"', ''))) {
              expect('').toBe('unexpected @composeDirective import ${element}');
            }
          });
        }
      }
    }
  });

  // @composeDirective is applied on schema
  expect(normalizedSDL).toMatch(
    /schema.*(@composeDirective|@federation__composeDirective)\(name:.*"@custom"\)/,
  );

  // schema contains @custom directive definition
  expect(normalizedSDL).toMatch(/directive.*@custom on OBJECT/);

  // @custom directive is applied on Product type
  expect(normalizedSDL).toMatch(/type Product.*@custom.*\{/);
});
