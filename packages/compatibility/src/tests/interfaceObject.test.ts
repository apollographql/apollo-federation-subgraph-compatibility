import { stripIgnoredCharacters } from 'graphql';
import { productsRequest, routerRequest } from '../utils/client';

describe('@interfaceObject', () => {
  test('verifies schema contains entity type marked as @interfaceObject', async () => {
    const serviceSDLQuery = await productsRequest({
      query: 'query { _service { sdl } }',
    });

    const { sdl } = serviceSDLQuery.data._service;
    const normalizedSDL = stripIgnoredCharacters(sdl);
    expect(normalizedSDL).toMatch(
      /type Inventory.*(@interfaceObject|@federation__interfaceObject)/,
    );
    expect(normalizedSDL).toMatch(
      /type Inventory.*(@key|@federation__key)\(fields:"id"( resolvable:true)?\)/,
    );
  });

  test('verifies @interfaceObject entity returns new fields', async () => {
    const resp = await routerRequest({
      query: `query ($id: ID!) { inventory(id: $id) { deprecatedProducts { sku reason } } }`,
      variables: { id: 'apollo-oss' },
    });

    expect(resp).not.toHaveProperty('errors');
    expect(resp).toMatchObject({
      data: {
        inventory: {
          deprecatedProducts: [
            {
              sku: 'apollo-federation-v1',
              reason: 'Migrate to Federation V2',
            },
          ],
        },
      },
    });
  });
});
