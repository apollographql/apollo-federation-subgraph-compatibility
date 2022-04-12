require 'rack'
require 'json'
require 'graphql'
require 'apollo-federation'
require 'sinatra/base'

class GraphQLServer < Sinatra::Base
  before do
    response.headers['Access-Control-Allow-Origin'] = '*'
  end

  post '/' do
    req_vars = JSON.parse(request.body.read)
    query = req_vars['query']
    operation_name = req_vars['operationName']
    vars = req_vars['variables'] || {}

    result = ProductSchema.execute(
      query,
      operation_name: operation_name,
      variables: vars,
      context: {
        tracing_enabled: ApolloFederation::Tracing.should_add_traces({
          'apollo-federation-include-trace' => request.env['HTTP_APOLLO_FEDERATION_INCLUDE_TRACE']
        })
      }
    )
    headers 'Content-Type' => 'application/json'
    body JSON.dump(result.to_h)
  end

  options '*' do
    [
      200,
      {
        'access-control-allow-origin' => '*',
        'access-control-allow-headers' => '*'
      },
      ''
    ]
  end
end

class BaseField < GraphQL::Schema::Field
  include ApolloFederation::Field
end

class BaseObject < GraphQL::Schema::Object
  include ApolloFederation::Object

  field_class BaseField
end

class ProductVariation < BaseObject
  field :id, ID, null: false
end

class ProductDimension < BaseObject
  field :size, String, null: true
  field :weight, Float, null: true
end

class User < BaseObject
  extend_type
  key fields: 'email'

  field :email, ID, null: false, external: true
  field :total_products_created, Int, null: true, external: true
end

class Product < BaseObject
  key fields: 'id'
  key fields: 'sku package'
  key fields: 'sku variation { id }'

  field :id, ID, null: false
  field :sku, String, null: true
  field :package, String, null: true
  field :variation, ProductVariation, null: true
  field :dimensions, ProductDimension, null: true
  field :created_by, User, null: true, provides: { fields: 'totalProductsCreated' }

  def self.resolve_reference(object, _context)
    if object[:id]
      PRODUCTS.find { |product| product[:id] == object[:id] }
    elsif object[:sku] && object[:package]
      PRODUCTS.find { |product| product[:sku] == object[:sku] && product[:package] == object[:package] }
    elsif object[:sku] && object[:variation]
      PRODUCTS.find { |product| product[:sku] == object[:sku] && product[:variation][:id] == object[:variation]["id"] }
    else
      nil
    end
  end
end

PRODUCTS = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: { id: "OSS" },
    dimensions: { size: "small", weight: 1 },
    created_by: { email: "support@apollographql.com", total_products_created: 1337 }
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: { id: "platform" },
    dimensions: { size: "small", weight: 1 },
    created_by: { email: "support@apollographql.com", total_products_created: 1337 }
  },
].freeze

class Query < BaseObject
  field :product, Product, null: true do
    argument :id, ID, required: true
  end

  def product(id:)
    PRODUCTS.find { |product| product[:id] == id }
  end
end

class ProductSchema < GraphQL::Schema
  include ApolloFederation::Schema
  use ApolloFederation::Tracing

  query(Query)
end
