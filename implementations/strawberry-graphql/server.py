from typing import Optional, List

import strawberry

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


def get_product_variation(root: "Product") -> Optional["ProductVariation"]:
    if root.variation_id:
        return ProductVariation(root.variation_id)

    return None


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
    return ProductDimension(size="small", weight="1", unit="kg")


def get_product_created_by() -> Optional["User"]:
    return User(
        email="support@apollographql.com",
        name="Jane Smith",
        total_products_created="1337",
        years_of_employment="10",
    )


@strawberry.federation.type(extend=True, keys=["email"])
class User:
    email: strawberry.ID = strawberry.federation.field(external=True)
    name: Optional[str] = strawberry.federation.field(override="users")
    total_products_created: Optional[int] = strawberry.federation.field(external=True)
    years_of_employment: int = strawberry.federation.field(external=True)

    # TODO: the camel casing will be fixed in a future release of Strawberry
    @strawberry.federation.field(requires=["totalProductsCreated", "yearsOfEmployment"])
    def average_products_created_per_year(self) -> Optional[int]:
        if self.total_products_created is not None:
            return round(self.total_products_created / self.years_of_employment)

        return None

    @classmethod
    def resolve_reference(cls, **data) -> Optional["User"]:
        if email := data.get("email"):
            years_of_employment = data.get("yearsOfEmployment")

            return User(
                email=email,
                name="Jane Smith",
                total_products_created=1337,
                years_of_employment=years_of_employment,
            )

        return None


@strawberry.federation.type(shareable=True)
class ProductDimension:
    size: Optional[str]
    weight: Optional[float]
    unit: Optional[str] = strawberry.federation.field(inaccessible=True)


@strawberry.type
class ProductVariation:
    id: strawberry.ID


@strawberry.type
class CaseStudy:
    case_number: strawberry.ID
    description: Optional[str]


@strawberry.federation.type(keys=["study { caseNumber }"])
class ProductResearch:
    study: CaseStudy
    outcome: Optional[str]


@strawberry.federation.type(keys=["sku package"])
class DeprecatedProduct:
    sku: str
    package: str
    reason: Optional[str]
    created_by: Optional[User]


@strawberry.federation.type(keys=["id", "sku package", "sku variation { id }"])
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
        provides=["totalProductsCreated"], resolver=get_product_created_by
    )
    notes: Optional[str] = strawberry.federation.field(tags=["internal"])
    research: List[ProductResearch]

    @classmethod
    def from_data(cls, data: dict):
        return cls(
            id=data["id"],
            sku=data["sku"],
            package=data["package"],
            variation_id=data["variation"],
            notes="hello",
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
    @strawberry.field
    def product(self, id: strawberry.ID) -> Optional[Product]:
        data = next((product for product in products if product["id"] == id), None)

        if not data:
            return None

        return Product.from_data(data)

    @strawberry.field(deprecation_reason="Use product query instead")
    def deprecated_product(self, sku: str, package: str) -> Optional[DeprecatedProduct]:
        return None


schema = strawberry.federation.Schema(query=Query, enable_federation_2=True)
