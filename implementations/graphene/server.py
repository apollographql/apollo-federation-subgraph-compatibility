from flask import Flask
from graphene_federation.tag import tag
from graphql_server.flask import GraphQLView
from graphene import ObjectType, Field, Float, ID, Int, String, List, NonNull
from graphene_federation import build_schema, extend, external, key, provides, requires, inaccessible, override, \
    shareable

# -------- data --------

dimension = {
    "size": "small",
    "weight": 1,
    "unit": "kg",
}

user = {
    "email": "support@apollographql.com",
    "name": "Jane Smith",
    "total_products_created": 1337,
}

deprecated_product = {
    "sku": "apollo-federation-v1",
    "package": "@apollo/federation-v1",
    "reason": "Migrate to Federation V2",
    "created_by": user,
}

products_research = [
    {
        "study": {
            "case_number": "1234",
            "description": "Federation Study",
        },
        "outcome": None,
    },
    {
        "study": {
            "case_number": "1235",
            "description": "Studio Study",
        },
        "outcome": None,
    },
]

products = [
    {
        "id": "apollo-federation",
        "sku": "federation",
        "package": "@apollo/federation",
        "variation": {"id": "OSS"},
        "dimensions": dimension,
        "research": [products_research[0]],
        "created_by": user,
        "notes": None,
    },
    {
        "id": "apollo-studio",
        "sku": "studio",
        "package": "",
        "variation": {"id": "platform"},
        "dimensions": dimension,
        "research": [products_research[1]],
        "created_by": user,
        "notes": None,
    },
]


# -------- types --------


@extend(fields='email')
class User(ObjectType):
    average_products_created_per_year = requires(field=Int(), fields=["total_products_created", "years_of_employment"])
    email = external(ID(required=True))
    name = override(String(), _from="users")
    total_products_created = external(Int())
    years_of_employment = external(Int(required=True))

    def resolve_average_products_created_per_year(self, info, *args, **kwargs):
        if self.total_products_created and self.years_of_employment:
            return round(self.total_products_created / self.years_of_employment)

        return None

    def __resolve_reference(self, info, **kwargs):
        if user['email'] == self.email:
            total_products = user['total_products_created']
            if self.total_products_created:
                total_products = self.total_products_created

            return User(
                email=self.email,
                name=user['name'],
                total_products_created=total_products,
                years_of_employment=self.years_of_employment
            )

        return self


class ProductVariation(ObjectType):
    id = ID(required=True)


@shareable
class ProductDimension(ObjectType):
    size = String()
    weight = Float()
    unit = inaccessible(String())


class CaseStudy(ObjectType):
    case_number = ID(required=True)
    description = String()


@key(fields="study { caseNumber }")
class ProductResearch(ObjectType):
    study = Field(CaseStudy, required=True)
    outcome = String()

    def __resolve_reference(self, info, **kwargs):
        return ProductResearch(**get_product_research_by_study(self.study))


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
    created_by = provides(Field(User), fields='total_products_created')
    notes = tag(String(), name="internal")
    research = List(NonNull(ProductResearch), required=True)

    def __resolve_reference(self, info, **kwargs):
        if self.id:
            return Product(**get_product_by_id(self.id))
        elif self.sku and self.package:
            return Product(**get_product_by_sku_and_package(self.sku, self.package))
        else:
            return Product(**get_product_by_sku_and_variation(self.sku, self.variation))


@key(fields="sku package")
class DeprecatedProduct(ObjectType):
    sku = String(required=True)
    package = String(required=True)
    reason = String()
    created_by = Field(User)

    def __resolve_reference(self, info, **kwargs):
        return DeprecatedProduct(**get_deprecated_product_by_sku_and_package(self.sku, self.package))


class Query(ObjectType):
    product = Field(Product, id=ID(required=True))
    deprecated_product = Field(DeprecatedProduct, sku=String(required=True), package=String(required=True),
                               deprecation_reason="Use product query instead")

    def resolve_product(self, info, id):
        return get_product_by_id(id)

    def resolve_deprecated_product(self, info, sku, package):
        return get_deprecated_product_by_sku_and_package(sku, package)


# -------- resolvers --------


def get_product_by_id(id):
    return next((product for product in products if product['id']
                 == id), None)


def get_product_by_sku_and_package(sku, package):
    return next((product for product in products if product['sku']
                 == sku and product['package'] == package), None)


def get_product_by_sku_and_variation(sku, variation):
    return next((product for product in products if product['sku']
                 == sku and product['variation'] == variation), None)


def get_deprecated_product_by_sku_and_package(sku, package):
    if deprecated_product['sku'] == sku and deprecated_product['package'] == package:
        return deprecated_product

    return None


def get_product_research_by_study(study):
    return next((product for product in products_research if product['study']['case_number']
                 == study['caseNumber']), None)


# -------- server --------


schema = build_schema(query=Query)
app = Flask(__name__)
app.add_url_rule('/', view_func=GraphQLView.as_view(
    'graphql',
    schema=schema
))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=4001)
