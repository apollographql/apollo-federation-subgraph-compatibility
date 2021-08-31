from typing import Optional

import strawberry
from strawberry.arguments import UNSET

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


def get_product_variation(root) -> Optional["ProductVariation"]:
    # TODO: this doesn't look like it is tested yet


def get_product_by_id(id: strawberry.ID) -> Optional["Product"]:
    data = next((product for product in products if product["id"] == id), None)

    if not data:
        return None

    return Product.from_data(data)


def get_product_by_sku_and_package(sku: str, package: str) -> Optional["Product"]:
    data = next(
        (
            product
            for product in products
            if product["sku"] == sku and product["package"] == package
        ),
        None,
    )

    if not data:
        return None

    return Product.from_data(data)


def get_product_by_sku_and_variation(sku: str, variation: dict) -> Optional["Product"]:
    data = next(
        (
            product
            for product in products
            if product["sku"] == sku and product["variation"] == variation["id"]
        ),
        None,
    )

    if not data:
        return None

    return Product.from_data(data)


def get_product_dimensions() -> Optional["ProductDimension"]:
    return ProductDimension(size="1", weight="1")


def get_product_created_by() -> Optional["User"]:
    return User(email="support@apollographql.com", total_products_created="1991")


@strawberry.federation.type(extend=True, keys=["email"])
class User:
    email: strawberry.ID = strawberry.federation.field(external=True)
    total_products_created: Optional[int] = strawberry.federation.field(external=True)


@strawberry.type
class ProductDimension:
    size: Optional[str]
    weight: Optional[float]


@strawberry.type
class ProductVariation:
    id: strawberry.ID


@strawberry.federation.type(keys=["id", "sku package", "sky variation { id }"])
class Product:
    id: strawberry.ID
    sku: Optional[str]
    package: Optional[str]
    variation_id: strawberry.Private[str]
    variation: Optional[ProductVariation] = strawberry.field(
        resolver=get_product_variation
    )
    dimensions: Optional[ProductDimension] = strawberry.field(
        resolver=get_product_dimensions
    )
    created_by: Optional[User] = strawberry.federation.field(
        provides=["total_products_created"], resolver=get_product_created_by
    )

    @classmethod
    def from_data(cls, data: dict):
        return cls(
            id=data["id"],
            sku=data["sku"],
            package=data["package"],
            variation_id=data["variation"],
        )

    @classmethod
    def resolve_reference(cls, **data) -> "Product":
        if "id" in data:
            return get_product_by_id(id=data["id"])

        if "sku" in data and "package" in data:
            return get_product_by_sku_and_package(
                sku=data["sku"], package=data["package"]
            )

        return get_product_by_sku_and_variation(
            sku=data["sku"], variation=data["variation"]
        )


@strawberry.federation.type(extend=True)
class Query:
    product: Optional[Product] = strawberry.field(resolver=get_product_by_id)


schema = strawberry.federation.Schema(query=Query)
