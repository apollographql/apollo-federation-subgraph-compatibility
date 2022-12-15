import { productsRequest } from '../utils/client';
import { stripIgnoredCharacters } from 'graphql';

test('@tag', async () => {
  const response = await productsRequest({
    query: 'query { _service { sdl } }',
  });

  const { sdl } = response.data._service;
  const normalizedSDL = stripIgnoredCharacters(sdl);
  expect(normalizedSDL).not.toContain('@federation__tag');
  expect(normalizedSDL).toContain('@tag(name:"internal")');
});
