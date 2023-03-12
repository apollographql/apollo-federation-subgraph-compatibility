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
  shareable
  field :size, String, null: true
  field :weight, Float, null: true
  field :unit, String, null: true, inaccessible: true
end

class CaseStudy < BaseObject
  field :caseNumber, ID, null: false
  field :description, String, null: true
end

class ProductResearch < BaseObject
  key fields: 'study { caseNumber }'

  field :study, CaseStudy, null: false
  field :outcome, String, null: true

  def self.resolve_reference(object, _context)
    RESEARCH.find { |research| research[:study][:caseNumber] == object[:study]["caseNumber"] }
  end
end

class User < BaseObject
  extend_type
  key fields: 'email'

  field :averageProductsCreatedPerYear, Int, null: true, requires: { fields: [:totalProductsCreated, :yearsOfEmployment] }
  field :email, ID, null: false, external: true
  field :name, String, null: true, override: { from: 'users' }
  field :total_products_created, Int, null: true, external: true
  field :yearsOfEmployment, Int, null: false, external: true

  def averageProductsCreatedPerYear
    unless object[:totalProductsCreated].nil? and object[:yearsOfEmployment].nil?
      (object[:totalProductsCreated] + object[:yearsOfEmployment] / 2) / object[:yearsOfEmployment]
    else
      nil
    end
  end

  def self.resolve_reference(object, _context)
    if object[:email] == 'support@apollographql.com'
      object.merge(DEFAULT_USER)
    else
      nil
    end
  end
end

class DeprecatedProduct < BaseObject
  key fields: 'sku package'

  field :sku, String, null: false
  field :package, String, null: false
  field :reason, String, null: true
  field :created_by, User, null: true

  def self.resolve_reference(object, _context)
    if object[:sku] == DEPRECATED_PRODUCT[:sku] and object[:package] == DEPRECATED_PRODUCT[:package]
      DEPRECATED_PRODUCT
    end
  end
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
  field :notes, String, null: true, tags: [{ name: 'internal' }]
  field :research, [ProductResearch], null:false

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

class Inventory < BaseObject
  key fields: 'id'
  interface_object

  field :id, ID, null: false
  field :deprecatedProducts, [DeprecatedProduct], null:false

  def self.resolve_reference(object, _context)
    if object[:id] == INVENTORY[:id]
      INVENTORY
    else
      nil
    end
  end
end

DEFAULT_USER = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  total_products_created: 1337
}

RESEARCH = [
  {
    study: {
      caseNumber: "1234",
      description: "Federation Study"
    }
  },
  {
    study: {
      caseNumber: "1235",
      description: "Studio Study"
    }
  }
].freeze

DEPRECATED_PRODUCT = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
  createdBy: DEFAULT_USER
}

PRODUCTS = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: { id: "OSS" },
    dimensions: { size: "small", weight: 1, unit: "kg" },
    created_by: DEFAULT_USER,
    research: [ RESEARCH[0] ]
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: { id: "platform" },
    dimensions: { size: "small", weight: 1, unit: "kg" },
    created_by: DEFAULT_USER,
    research: [ RESEARCH[1] ]
  },
].freeze

INVENTORY = {
  id: "apollo-oss",
  deprecatedProducts: [DEPRECATED_PRODUCT]
}

class Query < BaseObject
  field :product, Product, null: true do
    argument :id, ID, required: true
  end
  field :deprecated_product, DeprecatedProduct, null: true do
    argument :sku, String, required: true
    argument :package, String, required: true
  end

  def product(id:)
    PRODUCTS.find { |product| product[:id] == id }
  end

  def deprecated_product(sku:, package:)
    if sku == DEPRECATED_PRODUCT[:sku] and package == DEPRECATED_PRODUCT[:package]
      DEPRECATED_PRODUCT
    end
  end
end

class ProductSchema < GraphQL::Schema
  include ApolloFederation::Schema
  federation version: '2.0'
  use ApolloFederation::Tracing

  query(Query)
  orphan_types Inventory
end
