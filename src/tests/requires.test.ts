import { routerRequest } from '../utils/client';

test('@requires', async () => {
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
