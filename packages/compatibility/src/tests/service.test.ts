import { productsRequest } from '../utils/client';

test('service field', async () => {
  const serviceSDLQuery = await productsRequest({
    query: `query {
      __type(name: "_Service") {
        fields {
          name
          type {
            kind
            ofType {
              name
            }
            name
          }
        }
      }
    }`,
  });

  expect(serviceSDLQuery.data).toMatchObject({
    __type: {
      fields: [
        {
          name: 'sdl',
          type: {
            kind: 'NON_NULL',
            ofType: {
              name: 'String',
            },
          },
        },
      ],
    },
  });
});
