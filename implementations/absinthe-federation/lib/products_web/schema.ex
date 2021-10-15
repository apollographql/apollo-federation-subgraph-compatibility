defmodule ProductsWeb.Schema do
  use Absinthe.Schema
  use Absinthe.Federation.Schema

  defmodule Product do
    defstruct [:id, :sku, :package, :variation]
  end

  defmodule User do
    defstruct [:email, :name, :total_products_created]
  end

  @desc """
  extend type User @key(fields: "email") {
    email: ID! @external
    totalProductsCreated: Int @external
  }
  """
  object :user do
    extends()
    key_fields("email")

    field(:email, non_null(:id)) do
      external()
    end

    field :total_products_created, :integer do
      external()
    end

    field(:_resolve_reference, :user) do
      resolve(fn %{"email" => email}, _ -> {:ok, Enum.find(users(), &(&1.email == email))} end)
    end
  end

  @desc """
  type ProductDimension {
    size: String
    weight: Float
  }
  """
  object :product_dimension do
    field(:size, :string)
    field(:weight, :float)
  end

  @desc """
  type ProductVariation {
    id: ID!
  }
  """
  object :product_variation do
    field(:id, non_null(:id))
  end

  @desc """
  type Product @key(fields: "id") @key(fields: "sku package") @key(fields: "sku variation { id }") {
    id: ID!
    sku: String
    package: String
    variation: ProductVariation
    dimensions: ProductDimension
    createdBy: User @provides(fields: "totalProductsCreated")
  }
  """
  object :product do
    key_fields(["id", "sku package", "sku variation { id }"])
    field(:id, non_null(:id))
    field(:sku, :string)
    field(:package, :string)
    field(:variation, :product_variation)

    field(:dimensions, :product_dimension) do
      resolve(&resolve_product_dimensions/3)
    end

    field :created_by, :user do
      provides_fields("totalProductsCreated")
      resolve(&resolve_product_created_by/3)
    end

    field :_resolve_reference, :product do
      resolve(&resolve_product_reference/2)
    end
  end

  @desc """
  extend type Query {
    product(id: ID!): Product
  }
  """
  query name: "Query" do
    extends()

    field :product, :product do
      arg(:id, non_null(:id))
      resolve(&resolve_product/3)
    end
  end

  defp resolve_product(_parent, %{id: id}, _ctx) do
    {:ok, Enum.find(products(), &(&1.id == id))}
  end

  defp resolve_product_created_by(_product, _, _ctx) do
    {:ok, List.first(users())}
  end

  defp resolve_product_dimensions(_product, _, _ctx) do
    {:ok, %{size: 1, weight: 1}}
  end

  defp resolve_product_reference(%{id: id}, _ctx) do
    {:ok, Enum.find(products(), &(&1.id == id))}
  end

  defp resolve_product_reference(%{sku: sku, package: package}, _ctx) do
    {:ok, Enum.find(products(), &(&1.sku == sku and &1.package == package))}
  end

  # TODO: Fix this nested string -> atom conversion
  defp resolve_product_reference(%{sku: sku, variation: %{"id" => variation_id}}, _ctx) do
    {:ok, Enum.find(products(), &(&1.sku == sku and &1.variation.id == variation_id))}
  end

  defp products(),
    do: [
      %Product{
        id: "apollo-federation",
        sku: "federation",
        package: "@apollo/federation",
        variation: %{
          id: "OSS"
        }
      },
      %Product{
        id: "apollo-studio",
        sku: "studio",
        package: "",
        variation: %{
          id: "platform"
        }
      }
    ]

  defp users(),
    do: [
      %User{
        email: "support@apollographql.com",
        name: "Apollo Studio Support",
        total_products_created: 1337
      }
    ]
end
