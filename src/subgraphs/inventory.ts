import { readFileSync } from "fs";
import { resolve } from "path";
import { ApolloServer, gql, ApolloError } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";

const port = process.env.INVENTORY_PORT || 4003;
interface ProductReference {
    id: string;
    dimensions: ProductDimension
}
interface ProductDimension {
    size: string;
    weight: number;
}
class DeliveryEstimates {
    estimatedDelivery: string;
    fastestDelivery: string;

    constructor() {
        this.estimatedDelivery = "5/1/2019";
        this.fastestDelivery = "5/1/2019";
    }
}

const typeDefs = gql(readFileSync(resolve(__dirname, '..', '..', 'src', 'subgraphs', 'inventory.graphql'), { encoding: 'utf-8' }));
const resolvers = {
    Product: {
        delivery: (product: ProductReference, args: { zip: string }, context) => {
            //Validate Product has external information as per @requires
            if (product.id != 'federation') throw new ApolloError("product.id was not 'federation'");
            if (product.dimensions.size != '1') throw new ApolloError("product.dimensions.size was not '1'");
            if (product.dimensions.weight != 1) throw new ApolloError("product.dimensions.weight was not '1'");
            if (args.zip != '94111') throw new ApolloError("Prodct.delivery input zip was not '94111'");

            return new DeliveryEstimates();
        }
    }
}
const server = new ApolloServer({ schema: buildFederatedSchema({ typeDefs, resolvers }) });
server.listen({ port }).then(({ url }) => console.log(`Inventory subgraph ready at ${url}`));