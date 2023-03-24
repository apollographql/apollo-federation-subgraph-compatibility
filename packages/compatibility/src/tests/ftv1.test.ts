import { productsRequest } from '../utils/client';

test('ftv1', async () => {
  const resp = await productsRequest(
    {
      query: `query { __typename }`,
    },
    { 'apollo-federation-include-trace': 'ftv1' },
  );

  expect(resp).toEqual({
    data: {
      __typename: 'Query',
    },
    extensions: {
      ftv1: expect.any(String),
    },
  });
});
