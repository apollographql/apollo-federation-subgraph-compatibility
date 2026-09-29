package main

import (
	_ "embed"
	"log"
	"net/http"

	"graphql-go-compatibility/model"
	"graphql-go-compatibility/resolver"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/graphql/language/ast"
	"github.com/graphql-go/handler"
)

var userType = graphql.NewObject(graphql.ObjectConfig{
	Name: "User",
	Fields: graphql.Fields{
		"averageProductsCreatedPerYear": &graphql.Field{
			Type: graphql.Int,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				user, ok := p.Source.(*model.User)
				if ok {
					return resolver.CalculateAverageProductsCreatedPerYear(user)
				}
				return nil, nil
			},
		},
		"email": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"name": &graphql.Field{
			Type: graphql.String,
		},
		"totalProductsCreated": &graphql.Field{
			Type: graphql.Int,
		},
		"yearsOfEmployment": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
		},
	},
})

var productVariationType = graphql.NewObject(graphql.ObjectConfig{
	Name: "ProductVariation",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
	},
})

var productDimensionType = graphql.NewObject(graphql.ObjectConfig{
	Name: "ProductDimension",
	Fields: graphql.Fields{
		"size": &graphql.Field{
			Type: graphql.String,
		},
		"weight": &graphql.Field{
			Type: graphql.Float,
		},
		"unit": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var caseStudyType = graphql.NewObject(graphql.ObjectConfig{
	Name: "CaseStudy",
	Fields: graphql.Fields{
		"caseNumber": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"description": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var productResearchType = graphql.NewObject(graphql.ObjectConfig{
	Name: "ProductResearch",
	Fields: graphql.Fields{
		"study": &graphql.Field{
			Type: graphql.NewNonNull(caseStudyType),
		},
		"outcome": &graphql.Field{
			Type: graphql.String,
		},
	},
})

var productType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Product",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"sku": &graphql.Field{
			Type: graphql.String,
		},
		"package": &graphql.Field{
			Type: graphql.String,
		},
		"variation": &graphql.Field{
			Type: productVariationType,
		},
		"dimensions": &graphql.Field{
			Type: productDimensionType,
		},
		"createdBy": &graphql.Field{
			Type: userType,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return resolver.DefaultUser, nil
			},
		},
		"notes": &graphql.Field{
			Type: graphql.String,
		},
		"research": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(productResearchType))),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				product, ok := p.Source.(*model.Product)
				if ok {
					return resolver.FindProductResearchByProductId(product)
				}
				return nil, nil
			},
		},
	},
})

var deprecatedProductType = graphql.NewObject(graphql.ObjectConfig{
	Name: "DeprecatedProduct",
	Fields: graphql.Fields{
		"sku": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"package": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
		"reason": &graphql.Field{
			Type: graphql.String,
		},
		"createdBy": &graphql.Field{
			Type: userType,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return resolver.DefaultUser, nil
			},
		},
	},
})

var inventoryType = graphql.NewObject(graphql.ObjectConfig{
	Name: "Inventory",
	Fields: graphql.Fields{
		"id": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
		},
		"deprecatedProducts": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(deprecatedProductType))),
		},
	},
})

// vanilla graphql-go has no support for applied directives, so federation
// subgraph SDL is served as-is from products.graphql
//
//go:embed products.graphql
var sdl string

var anyType = graphql.NewScalar(graphql.ScalarConfig{
	Name: "_Any",
	Serialize: func(value interface{}) interface{} {
		return value
	},
	ParseValue: func(value interface{}) interface{} {
		return value
	},
	ParseLiteral: parseAnyLiteral,
})

func parseAnyLiteral(valueAST ast.Value) interface{} {
	switch valueAST := valueAST.(type) {
	case *ast.ObjectValue:
		value := make(map[string]interface{})
		for _, field := range valueAST.Fields {
			value[field.Name.Value] = parseAnyLiteral(field.Value)
		}
		return value
	case *ast.ListValue:
		values := make([]interface{}, 0, len(valueAST.Values))
		for _, v := range valueAST.Values {
			values = append(values, parseAnyLiteral(v))
		}
		return values
	case *ast.StringValue:
		return valueAST.Value
	case *ast.EnumValue:
		return valueAST.Value
	case *ast.BooleanValue:
		return valueAST.Value
	case *ast.IntValue:
		return graphql.Int.ParseLiteral(valueAST)
	case *ast.FloatValue:
		return graphql.Float.ParseLiteral(valueAST)
	default:
		return nil
	}
}

var serviceType = graphql.NewObject(graphql.ObjectConfig{
	Name: "_Service",
	Fields: graphql.Fields{
		"sdl": &graphql.Field{
			Type: graphql.NewNonNull(graphql.String),
		},
	},
})

var entityType = graphql.NewUnion(graphql.UnionConfig{
	Name: "_Entity",
	Types: []*graphql.Object{
		productType,
		userType,
		deprecatedProductType,
		productResearchType,
		inventoryType,
	},
	ResolveType: func(p graphql.ResolveTypeParams) *graphql.Object {
		if _, ok := p.Value.(*model.Product); ok {
			return productType
		}
		if _, ok := p.Value.(*model.User); ok {
			return userType
		}
		if _, ok := p.Value.(*model.DeprecatedProduct); ok {
			return deprecatedProductType
		}
		if _, ok := p.Value.(*model.ProductResearch); ok {
			return productResearchType
		}
		if _, ok := p.Value.(*model.Inventory); ok {
			return inventoryType
		}
		return nil
	},
})

var rootQuery = graphql.NewObject(graphql.ObjectConfig{
	Name: "Query",
	Fields: graphql.Fields{
		"product": &graphql.Field{
			Type: productType,
			Args: graphql.FieldConfigArgument{
				"id": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.ID),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				id, ok := params.Args["id"].(string)
				if ok {
					return resolver.FindProductById(id)
				}
				return nil, nil
			},
		},
		"deprecatedProduct": &graphql.Field{
			Type: deprecatedProductType,
			Args: graphql.FieldConfigArgument{
				"sku": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
				"package": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.String),
				},
			},
			Resolve: func(params graphql.ResolveParams) (interface{}, error) {
				sku, skuOk := params.Args["sku"].(string)
				pkg, pkgOk := params.Args["package"].(string)
				if skuOk && pkgOk {
					return resolver.FindDeprecatedProductBySkuAndPackage(sku, pkg)
				}
				return nil, nil
			},
			DeprecationReason: "Use product query instead",
		},
		"_service": &graphql.Field{
			Type: graphql.NewNonNull(serviceType),
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				return map[string]interface{}{"sdl": sdl}, nil
			},
		},
		"_entities": &graphql.Field{
			Type: graphql.NewNonNull(graphql.NewList(entityType)),
			Args: graphql.FieldConfigArgument{
				"representations": &graphql.ArgumentConfig{
					Type: graphql.NewNonNull(graphql.NewList(graphql.NewNonNull(anyType))),
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				representations, ok := p.Args["representations"].([]interface{})
				results := make([]interface{}, 0)
				if ok {
					for _, representation := range representations {
						raw, isAny := representation.(map[string]interface{})
						if isAny {
							typeName, typeSpecified := raw["__typename"].(string)
							if typeSpecified {
								switch typeName {
								case "Product":
									product, _ := resolver.ProductEntityResolver(raw)
									results = append(results, product)
								case "User":
									user, _ := resolver.UserEntityResolver(raw)
									results = append(results, user)
								case "DeprecatedProduct":
									deprecatedProduct, _ := resolver.DeprecatedProductEntityResolver(raw)
									results = append(results, deprecatedProduct)
								case "ProductResearch":
									research, _ := resolver.ProductResearchEntityResolver(raw)
									results = append(results, research)
								case "Inventory":
									inventory, _ := resolver.InventoryEntityResolver(raw)
									results = append(results, inventory)
								}
							} else {
								panic("Invalid entity representation - missing __typename")
							}
						}
					}
				}
				return results, nil
			},
		},
	},
})

var schema, _ = graphql.NewSchema(graphql.SchemaConfig{
	Query: rootQuery,
})

func main() {
	handler := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/", handler)

	log.Printf("graphql-go server is accepting requests at http://localhost:4001/")
	log.Fatal(http.ListenAndServe(":4001", nil))
}
