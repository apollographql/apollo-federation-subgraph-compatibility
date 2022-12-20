import { productsRequest } from '../utils/client';

test('federation specification', async () => {
  const serviceTypeQuery = await productsRequest({
    query: `query {
      __type(name: "_Service") {
        kind
        fields {
          name
          type {
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
    }`,
  });

  expect(serviceTypeQuery.data).toMatchObject({
    __type: {
      kind: 'OBJECT',
      fields: [
        {
          name: 'sdl',
          type: {
            kind: 'NON_NULL',
            ofType: {
              name: 'String',
              kind: 'SCALAR',
            },
          },
        },
      ],
    },
  });

  const entityTypeQuery = await productsRequest({
    query: `query {
      __type(name:"_Entity") {
        kind
        possibleTypes {
          name
        }
      }
    }`,
  });

  expect(entityTypeQuery.data).toMatchObject({
    __type: {
      kind: 'UNION',
      possibleTypes: [
        { name: 'Product' },
        { name: 'DeprecatedProduct' },
        { name: 'ProductResearch' },
        { name: 'User' },
      ],
    },
  });

  const anyTypeQuery = await productsRequest({
    query: `query {
      __type(name:"_Any") {
        kind
      }
    }`,
  });

  expect(anyTypeQuery.data).toMatchObject({
    __type: { kind: 'SCALAR' },
  });

  const fieldSetTypeQuery = await productsRequest({
    query: `query {
      __type(name:"FieldSet") {
        kind
      }
    }`,
  });

  expect(fieldSetTypeQuery.data).toMatchObject({
    __type: { kind: 'SCALAR' },
  });

  const linkPurposeTypeQuery = await productsRequest({
    query: `query {
      __type(name:"link__Purpose") {
        kind
      }
    }`,
  });

  expect(linkPurposeTypeQuery.data).toMatchObject({
    __type: { kind: 'ENUM' },
    // TODO: values
  });
  // TODO: directives
});
