from flask import Flask
from flask_graphql import GraphQLView
from graphene import ObjectType, Field, Float, ID, Int, String
from graphene_federation import build_schema, extend, external, key, provides


@extend(fields='email')
class User(ObjectType):
    email = external(ID(required=True))
    totalProductsCreated = external(Int())

    def resolve_total_products_created(parent, info, **kwargs):
        return 1337


class ProductVariation(ObjectType):
   id = ID(required=True)


class ProductDimension(ObjectType):
    size = String()
    weight = Float()


@key(fields='id')
@key(fields='sku package')
@key(fields='sku variation { id }')
@provides
class Product(ObjectType):
    id = ID(required=True)
    sku = String()
    package = String()
    variation = Field(ProductVariation)
    dimensions = Field(ProductDimension)
    createdBy = provides(Field(User), fields='totalProductsCreated')

    def resolve_variation(self, info, **kwargs):
        print(self)
        return get_product_variation(self)

    def resolve_dimensions(self, info, **kwargs):
        return {'size': 'small', 'weight': 1.0}

    def resolve_created_by(self, info, **kwargs):
        {'email': 'support@apollographql.com', 'totalProductsCreated': 1337}

    def __resolve_reference(self, info, **kwargs):
        if self.id:
            return Product(**get_product_by_id(self.id))
        elif self.sku and self.package:
            return Product(**get_product_by_sku_and_package(self.sku, self.package))
        else:
            return Product(**get_product_by_sku_and_variation(self.sku, self.variation))


class Query(ObjectType):
    product = Field(Product, id=ID(required=True))

    def resolve_product(self, info, id):
        return get_product_by_id(id)


schema= build_schema(Query, types=[Product])
app = Flask(__name__)
app.add_url_rule('/', view_func=GraphQLView.as_view(
    'graphql',
    schema=schema
))

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
    if isinstance(reference, Product) and reference.variation:
        return {'id': reference.variation}
    elif reference["variation"]:
        return {'id': reference["variation"]}
    variation = next((product for product in products if product['id']
                     == reference.id), None)
    return {'id': variation}


def get_product_by_id(id):
    return next((product for product in products if product['id']
                == id), None)


def get_product_by_sku_and_package(sku, package):
    return next((product for product in products if product['sku']
                == sku and product['package'] == package), None)


def get_product_by_sku_and_variation(sku, variation):
    return next((product for product in products if product['sku']
                == sku and product['variation'] == variation), None)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4001)
