import { RemoteGraphQLDataSource } from "@apollo/gateway";
import { gql } from "apollo-server-core";
import { readFileSync } from "fs";
import { print } from "graphql";
import { resolve } from "path";
interface IGraph {
    router: RemoteGraphQLDataSource;
    products: RemoteGraphQLDataSource
}

export class GraphClient {
    sources: IGraph;

    static instance: GraphClient

    constructor() {
        this.sources = {
            router: new RemoteGraphQLDataSource({ url: 'http://localhost:4000' }),
            products: new RemoteGraphQLDataSource({ url: 'http://localhost:4001' }),
        }
    }

    static init() {
        if (GraphClient.instance) throw new Error("Only one instance of GraphClient can exist");
        GraphClient.instance = new GraphClient();
    }

    async pingSources(): Promise<boolean> {
        try {
            const routerPing = await GraphClient.instance.sources.router.process({ request: { query: "query { __typename }" }, context: {} });
            const productsPing = await GraphClient.instance.sources.router.process({ request: { query: "query { __typename }" }, context: {} });

            if (routerPing.errors || productsPing.errors) return false;

            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async check_service(): Promise<boolean> {
        try {
            const productsPing = await GraphClient.instance.sources.products.process({ request: { query: "query { _service { sdl } }" }, context: {} });
            const productsRaw = readFileSync(resolve(__dirname, '..', '..', 'src', 'implementations', '_template_', 'products.graphql'), { encoding: 'utf-8' });

            if (!productsPing.data?._service?.sdl) return false;

            const implementingLibrarySchema = gql(productsPing.data._service.sdl);
            const productsReferenceSchema = gql(productsRaw);

            const implenentingLibraryTest = print(implementingLibrarySchema);
            const referenceSchema = print(productsReferenceSchema);

            if (implenentingLibraryTest == referenceSchema) return true;

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }

    async check_key_single(): Promise<boolean> {
        try {
            const productsPing = await GraphClient.instance.sources.products.process({
                request: {
                    query: "query ($representations: [_Any!]!){_entities(representations: $representations) {...on Product {sku}}}",
                    variables: {
                        representations: [
                            { __typename: "Product", id: "apollo-federation" }
                        ]
                    }
                }, context: {}
            });


            if (productsPing.data._entities[0].sku == "federation") return true;

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async check_key_multiple(): Promise<boolean> {
        try {
            const productsPing = await GraphClient.instance.sources.products.process({
                request: {
                    query: "query ($representations: [_Any!]!){_entities(representations: $representations) {...on Product {id}}}",
                    variables: {
                        representations: [
                            { __typename: "Product", sku: "federation", package: "@apollo/federation" }
                        ]
                    }
                }, context: {}
            });


            if (productsPing.data._entities[0].id == "apollo-federation") return true;

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async check_key_composite(): Promise<boolean> {
        try {
            const productsPing = await GraphClient.instance.sources.products.process({
                request: {
                    query: "query ($representations: [_Any!]!){_entities(representations: $representations) {...on Product {id}}}",
                    variables: {
                        representations: [
                            { __typename: "Product", sku: "federation", variation: { id: "OSS" } }
                        ]
                    }
                }, context: {}
            });


            if (productsPing.data._entities[0].id == "apollo-federation") return true;

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async check_requires(): Promise<boolean> {
        try {
            const productsPing = await GraphClient.instance.sources.products.process({
                request: {
                    query: "query ($id: ID!){ product(id: $id) { dimensions { size weight } } }",
                    variables: { id: "apollo-federation" }
                }, context: {}
            });


            if (productsPing.data.product.dimensions.size == "1" && productsPing.data.product.dimensions.weight == 1) return true;

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
    async check_provides(): Promise<boolean> {
        try {
            const productsPing = await GraphClient.instance.sources.products.process({
                request: {
                    query: "query ($id: ID!){ product(id: $id) { createdBy { email totalProductsCreated } } }",
                    variables: { id: "apollo-federation" }
                }, context: {}
            });


            if (productsPing.data.product.createdBy.totalProductsCreated !== 4) return true;

            return false;
        } catch (err) {
            console.log(err);
            return false;
        }
    }
}