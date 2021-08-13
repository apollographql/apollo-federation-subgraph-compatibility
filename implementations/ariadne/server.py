import uvicorn

from ariadne import QueryType
from ariadne.asgi import GraphQL
from ariadne.contrib.federation import FederatedObjectType, make_federated_schema


type_defs = '''
    # Ariadne doesn't support multiple directives per location
    # type Product @key(fields: "id") @key(fields: "sku package") @key(fields: "sku variation { id }") {
    type Product @key(fields: "id") {
        id: ID!
        sku: String
        package: String
        variation: ProductVariation
        dimensions: ProductDimension
        createdBy: User @provides(fields: "totalProductsCreated")
    }

    type ProductDimension {
        size: String
        weight: Float
    }

    type ProductVariation {
        id: ID!
    }

    type Query {
        product(id: ID!): Product
    }

    type User @key(fields: "email") @extends {
        email: ID! @external
        totalProductsCreated: Int @external
    }
'''

query = QueryType()
product = FederatedObjectType("Product")


@query.field("product")
def resolve_product(*_, id):
    return get_product_by_id(id)


@product.field('variation')
def resolve_product_variation(obj, *_):
    return get_product_variation(obj)


@product.field('dimensions')
def resolve_product_dimensions(*_):
    return {'size': '1', 'weight': 1}


@product.field('createdBy')
def resolve_product_created_by(*_):
    return {'email': 'support@apollographql.com',
            'totalProductsCreated': 1337}


@product.reference_resolver
def resolve_product_reference(_, _info, representation):
    return get_product_by_id(representation['id'])


schema = make_federated_schema(type_defs, [query, product])
application = GraphQL(schema)

products = [
    {
        "id": "apollo-federation",
        "sku": "federation",
        "package": "@apollo/federation",
        "variation": "OSS",
    },
    {
        "id": "apollo-studio",
        "sku": "studio",
        "package": "",
        "variation": "platform",
    },
]


def get_product_variation(reference):
    if reference['variation']:
        return {'id': reference['variation']}
    variation = next((product for product in products if product['id']
                     == reference['id']), None)
    return {'id': variation}


def get_product_by_id(id):
    return next((product for product in products if product['id']
                == id), None)


if __name__ == "__main__":
    uvicorn.run(application, host='0.0.0.0', port=4001)