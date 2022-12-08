import { productsRequest } from '../utils/client';
import { stripIgnoredCharacters } from 'graphql';

describe('@inaccessible', () => {
  it('should return @inaccessible directives in _service sdl', async () => {
    const response = await productsRequest({
      query: 'query { _service { sdl } }',
    });

    const { sdl } = response.data._service;
    const normalizedSDL = stripIgnoredCharacters(sdl);
    expect(normalizedSDL).not.toContain('@federation__inaccessible');
    expect(normalizedSDL).toContain('unit:String@inaccessible');
  });

  it('should be able to query @inaccessible fields via the products schema directly', async () => {
    const resp = await productsRequest({
      query: `
        query GetProduct($id: ID!) {
          product(id: $id) {
            dimensions {
              unit
            }
          }
        }
      `,
      variables: { id: 'apollo-federation' },
    });

    expect(resp).not.toHaveProperty('errors');
    expect(resp).toMatchObject({
      data: {
        product: {
          dimensions: {
            unit: 'kg',
          },
        },
      },
    });
  });
});
