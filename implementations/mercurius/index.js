const Fastify = require('fastify')
const mercurius = require('mercurius')
const fs = require('fs');
const gql = require('graphql-tag');
const {buildSubgraphSchema} = require('@apollo/subgraph')


const sdl = fs.readFileSync('products.graphql', 'utf-8');
const typeDefs = gql(sdl)

const products = [
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

  //Resolvers copied from implementions/apollo-server, no change.
  const resolvers = {
    Query: {
      /** @type {(_: any, args: any, context: any) => any} */
      product: (_, args, context) => {
        return products.find((p) => p.id == args.id);
      },
    },
    Product: {
      /** @type {(reference: any) => any} */
      variation: (reference) => {
        if (reference.variation) return { id: reference.variation };
        return { id: products.find((p) => p.id == reference.id)?.variation };
      },
      dimensions: () => {
        return { size: 'small', weight: 1 };
      },
      createdBy: () => {
        return { email: 'support@apollographql.com', totalProductsCreated: 1337 };
      },
      /** @type {(reference: any) => any} */
      __resolveReference: (reference) => {
        if (reference.id) return products.find((p) => p.id == reference.id);
        else if (reference.sku && reference.package)
          return products.find(
            (p) => p.sku == reference.sku && p.package == reference.package
          );
        else
          return products.find(
            (p) => p.sku == reference.sku && p.variation == reference.variation.id
          );
      },
    },
  };


const schema = buildSubgraphSchema([{ typeDefs, resolvers }]);
const app = Fastify()

app.register(mercurius, {schema,  path: '/'})

app.listen(process.env.PRODUCTS_PORT || 4001, '0.0.0.0', (err, url) => {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
      }
      console.log(`🚀 Server ready at ${url}`);
})
