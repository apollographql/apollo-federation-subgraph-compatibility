import { stripIgnoredCharacters } from 'graphql';
import { productsRequest } from '../utils/client';

test('@link', async () => {
  const response = await productsRequest({
    query: 'query { _service { sdl } }',
  });

  expect(response.data).toMatchObject({
    _service: {
      sdl: expect.stringContaining('@link'),
    },
  });

  const { sdl } = response.data._service;
  const normalizedSDL = stripIgnoredCharacters(sdl);

  const linksRegex = /@link\(([\s\S]+?)\)/g;
  // should have @link imports
  expect(linksRegex.test(normalizedSDL)).toBe(true);

  let fedLinkCount = 0;
  normalizedSDL.match(linksRegex).forEach((element) => {
    const urlRegex = /url:(\".+?\")/;
    // skip definitions
    if (urlRegex.test(element)) {
      const linkUrl = JSON.parse(element.match(urlRegex)[1]);
      const linkUrlSpecVersionRegex =
        /https:\/\/specs.apollo.dev\/federation\/v(.+)/;
      // only verify federation spec @links
      if (linkUrlSpecVersionRegex.test(linkUrl)) {
        fedLinkCount++;

        const federationVersion = linkUrl.match(linkUrlSpecVersionRegex)[1];
        // federation v2.0 through v2.7 are supported
        expect(federationVersion).toMatch(
          /2\.0|2\.1|2\.2|2\.3|2\.4|2\.5|2\.6|2\.7/,
        );

        const linkImportsRegex = /import:\[(.+?)\]/;
        if (linkImportsRegex.test(element)) {
          // verify federation imports
          const expected = [
            '@composeDirective',
            '@extends',
            '@external',
            '@inaccessible',
            '@interfaceObject',
            '@key',
            '@override',
            '@provides',
            '@requires',
            '@shareable',
            '@tag',
            'FieldSet',
          ];

          const linkImportsMatch = element.match(linkImportsRegex);
          const linkImports = linkImportsMatch[1].split(' ');
          linkImports.forEach((importedElement) => {
            if (!expected.includes(importedElement.replaceAll('"', ''))) {
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
