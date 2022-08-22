from typing import Optional

import uvicorn

from ariadne import QueryType, load_schema_from_path
from ariadne.asgi import GraphQL
from ariadne.contrib.federation import FederatedObjectType, make_federated_schema


# ------- data -------

dimension_data = {
    "size": "small",
    "weight": 1,
    "unit": "kg",
}

user_data = {
    "email": "support@apollographql.com",
    "name": "Jane Smith",
    "totalProductsCreated": 1337,
    "yearsOfEmployment": 10,
}


deprecated_product_data = {
    "sku": "apollo-federation-v1",
    "package": "@apollo/federation-v1",
    "reason": "Migrate to Federation V2",
    "createdBy": user_data["email"],
}

products_research_data = [
    {
        "study": {
            "caseNumber": "1234",
            "description": "Federation Study",
        },
        "outcome": None,
    },
    {
        "study": {
            "caseNumber": "1235",
            "description": "Studio Study",
        },
        "outcome": None,
    },
]


products_data = [
    {
        "id": "apollo-federation",
        "sku": "federation",
        "package": "@apollo/federation",
        "variation": {"id": "OSS"},
        "dimensions": dimension_data,
        "research": [products_research_data[0]],
        "createdBy": user_data["email"],
        "notes": None,
    },
    {
        "id": "apollo-studio",
        "sku": "studio",
        "package": "",
        "variation": {"id": "platform"},
        "dimensions": dimension_data,
        "research": [products_research_data[1]],
        "createdBy": user_data["email"],
        "notes": None,
    },
]


# ------- resolvers -------


def get_product_by_id(id: str) -> Optional[dict]:
    return next((product for product in products_data if product["id"] == id), None)


def get_product_by_sku_and_package(sku: str, package: str) -> Optional[dict]:
    return next(
        (
            product
            for product in products_data
            if product["sku"] == sku and product["package"] == package
        ),
        None,
    )


def get_product_by_sku_and_variation(sku: str, variation: dict) -> Optional[dict]:
    return next(
        (
            product
            for product in products_data
            if product["sku"] == sku and product["variation"]["id"] == variation["id"]
        ),
        None,
    )


# ------- schema -------

query = QueryType()
product = FederatedObjectType("Product")
deprecated_product = FederatedObjectType("DeprecatedProduct")
product_research = FederatedObjectType("ProductResearch")
user = FederatedObjectType("User")

schema = load_schema_from_path("schema.graphql")


@query.field("product")
def resolve_product(*_, id):
    return get_product_by_id(id)


@query.field("deprecatedProduct")
def resolve_deprecated_product(*_, sku: str, package: str):
    if (
        sku == deprecated_product_data["sku"]
        and package == deprecated_product_data["package"]
    ):
        return deprecated_product_data

    return None


# ------- product -------


@product.field("variation")
def resolve_product_variation(obj, *_):
    if obj["variation"]:
        return {"id": obj["variation"]["id"]}

    variation = next(
        (product for product in products_data if product["id"] == obj["id"]), None
    )

    return {"id": variation}


@product.field("dimensions")
def resolve_product_dimensions(*_):
    return dimension_data


@product.field("createdBy")
def resolve_product_created_by(*_):
    return user_data


@product.reference_resolver
def resolve_product_reference(_, _info, representation):
    if "sku" in representation and "package" in representation:
        return get_product_by_sku_and_package(
            representation["sku"], representation["package"]
        )
    if "sku" in representation and "variation" in representation:
        return get_product_by_sku_and_variation(
            representation["sku"], representation["variation"]
        )
    return get_product_by_id(representation["id"])


# ------- deprecated product -------


@deprecated_product.reference_resolver
def resolve_deprecated_product_reference(_, _info, representation):
    return deprecated_product_data


# ------- product research -------


@product_research.reference_resolver
def resolve_product_research_reference(_, _info, representation):
    case_number = representation["study"]["caseNumber"]

    return next(
        (
            research
            for research in products_research_data
            if research["study"]["caseNumber"] == case_number
        ),
        None,
    )


# ------- user -------


@user.reference_resolver
def resolve_user_reference(_, _info, representation):
    return user_data


@user.field("averageProductsCreatedPerYear")
def resolve_user_average_products_created_per_year(obj, info):
    if obj.get("totalProductCreated") is None:
        return 0

    return obj["totalProductsCreated"] / obj["yearsOfEmployment"]


schema = make_federated_schema(
    schema, [query, product, deprecated_product, product_research, user]
)
application = GraphQL(schema)


if __name__ == "__main__":
    uvicorn.run(application, host="0.0.0.0", port=4001)
