import { stripIgnoredCharacters } from 'graphql';
import { productsRequest } from '../utils/client';

describe('@provides', () => {
  test('should return @provides directives in _service sdl', async () => {
    const response = await productsRequest({
      query: 'query { _service { sdl } }',
    });

    const { sdl } = response.data._service;
    expect(stripIgnoredCharacters(sdl)).toMatch(
      /createdBy:User(@provides|@federation__provides)\(fields:"totalProductsCreated"\)/,
    );
  });

  test('should return locally computed @provides field', async () => {
    const resp = await productsRequest({
      query: `#graphql
      query ($id: ID!) {
        product(id: $id) {
          createdBy { email totalProductsCreated }
        }
      }`,
      variables: { id: 'apollo-federation' },
    });

    expect(resp).not.toHaveProperty('errors');
    expect(resp).toMatchObject({
      data: {
        product: {
          createdBy: {
            email: 'support@apollographql.com',
            totalProductsCreated: expect.any(Number),
          },
        },
      },
    });

    const totalProductsCreated: number =
      resp.data.product.createdBy.totalProductsCreated;
    expect(totalProductsCreated).not.toEqual(4);
  });
});
