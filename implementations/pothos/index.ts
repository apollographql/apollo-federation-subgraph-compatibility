import { ApolloServer } from 'apollo-server';
import SchemaBuilder from '@pothos/core';
import DirectivesPlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';

const port = process.env.PRODUCTS_PORT || 4001;

const builder = new SchemaBuilder<{
  DefaultFieldNullability: true;
}>({
  plugins: [DirectivesPlugin, FederationPlugin],
  useGraphQLToolsUnorderedDirectives: true,
  defaultFieldNullability: true,
});

interface Product {
  id: string;
  sku: string;
  package: string;
  variation: string;
}

const products: Product[] = [
  {
    id: 'apollo-federation',
    sku: 'federation',
    package: '@apollo/federation',
    variation: 'OSS',
  },
  {
    id: 'apollo-studio',
    sku: 'studio',
    package: '',
    variation: 'platform',
  },
];

const ProductVariation = builder.objectRef<{ id: string }>('ProductVariation').implement({
  fields: (t) => ({
    id: t.exposeID('id', { nullable: false }),
  }),
});

const ProductDimension = builder
  .objectRef<{ size: string; weight: number; unit: string }>('ProductDimension')
  .implement({
    shareable: true,
    fields: (t) => ({
      size: t.exposeString('size'),
      weight: t.exposeInt('weight'),
      unit: t.exposeString('unit', {
        inaccessible: true,
      }),
    }),
  });

const ProductType = builder.objectRef<Product>('Product').implement({
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false,
    }),
    sku: t.exposeString('sku'),
    package: t.string({
      resolve: (product) => product.package
    }),
    dimensions: t.field({
      type: ProductDimension,
      resolve: () => ({ size: 'small', weight: 1, unit: 'kg' }),
    }),
    variation: t.field({
      type: ProductVariation,
      resolve: (product) => ({ id: product.variation }),
    }),
    notes: t.stringList({
      tag: 'internal',
      inaccessible: true,
      resolve: () => ['This is a note'],
    }),
    createdBy: t.field({
      type: User.provides<{ totalProductsCreated: number }>('totalProductsCreated'),
      resolve: () => ({
        totalProductsCreated: 1,
        email: 'support@apollographql.com',
      }),
    }),
  }),
});

const User = builder
  .externalRef('User', builder.selection<{ email: string }>('email'), (key) => key)
  .implement({
    externalFields: (t) => ({
      email: t.string({ nullable: false }),
      totalProductsCreated: t.int(),
    }),
    fields: (t) => ({
      name: t.string({
        override: { from: 'users' },
        resolve: () => 'Jane Smith',
      }),
    }),
  });

builder.asEntity(ProductType, {
  key:  [
    builder.selection<{ id: string }>('id'),
    builder.selection<{ sku: string; package: string }>('sku package'),
    builder.selection<{
      sku: string;
      variation: {
        id: string;
      };
    }>('sku variation { id }'),
  ],
  resolveReference: (key) => {
    if ('id' in key) {
      return products.find((product) => product.id === key.id);
    }
    if ('variation' in key) {
      return products.find(
        (product) => product.sku === key.sku && product.variation === key.variation.id,
      );
    }

    return products.find((product) => product.sku === key.sku && product.package === key.package);
  },
});

builder.queryType({
  fields: (t) => ({
    product: t.field({
      type: ProductType,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args) => products.find((product) => product.id === args.id),
    }),
  }),
});

export const schema = builder.toSubGraphSchema({});



const server = new ApolloServer({
  schema: builder.toSubGraphSchema({}),
});

server
  .listen({ port })
  .then(({ url }) => console.log(`Products subgraph ready at ${url}`))
  .catch(console.error);
