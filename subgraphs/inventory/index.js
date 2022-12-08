import { readFileSync } from 'fs';
import { gql } from 'graphql-tag';
import { GraphQLError } from 'graphql';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { buildSubgraphSchema } from '@apollo/subgraph';

const serverPort = parseInt(process.env.INVENTORY_PORT || '') || 4003;

class DeliveryEstimates {
  /** @type {string} */
  estimatedDelivery;
  /** @type {string} */
  fastestDelivery;

  constructor() {
    this.estimatedDelivery = '5/1/2019';
    this.fastestDelivery = '5/1/2019';
  }
}

const typeDefs = gql(readFileSync('inventory.graphql', 'utf-8'));

const resolvers = {
  Product: {
    /** @type {(product: import('./typings').ProductReference, args: any, context: any) => any} */
    delivery: (product, args, context) => {
      // Validate Product has external information as per @requires
      if (product.id != 'apollo-federation')
        throw new GraphQLError("product.id was not 'apollo-federation'");
      if (product.dimensions.size != 'small')
        throw new GraphQLError("product.dimensions.size was not 'small'");
      if (product.dimensions.weight != 1)
        throw new GraphQLError("product.dimensions.weight was not '1'");
      if (args.zip != '94111')
        throw new GraphQLError("product.delivery input zip was not '94111'");

      return new DeliveryEstimates();
    },
  },
};

const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

startStandaloneServer(server, {
  listen: { port: serverPort },
}).then(({ url }) => {
  if (process.send) {
    process.send('ready');
  }
  console.log(`🚀  Inventory subgraph ready at ${url}`);
});
