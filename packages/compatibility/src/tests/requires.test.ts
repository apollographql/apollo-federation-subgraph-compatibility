import { stripIgnoredCharacters } from 'graphql';
import { productsRequest, routerRequest } from '../utils/client';

describe('@requires', () => {
  test('should return @requires directives in _service sdl', async () => {
    const response = await productsRequest({
      query: 'query { _service { sdl } }',
    });

    const { sdl } = response.data._service;
    expect(stripIgnoredCharacters(sdl)).toMatch(
      /averageProductsCreatedPerYear:Int(@requires|@federation__requires)\(fields:"totalProductsCreated yearsOfEmployment"\)/,
    );
  });

  test('should return field with computed values from @requires field set', async () => {
    const resp = await routerRequest({
      query: `#graphql
        query ($id: ID!) {
          product(id: $id) { createdBy { averageProductsCreatedPerYear email } }
        }`,
      variables: { id: 'apollo-federation' },
    });

    expect(resp).not.toHaveProperty('errors');
    expect(resp).toMatchObject({
      data: {
        product: {
          createdBy: {
            averageProductsCreatedPerYear: expect.any(Number),
            email: 'support@apollographql.com',
          },
        },
      },
    });
  });
});
