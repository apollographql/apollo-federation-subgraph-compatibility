package main

import (
	"log"
	"net/http"

	"graphql-go-compatibility/model"
	"graphql-go-compatibility/resolver"

	"github.com/graphql-go/graphql"
	"github.com/graphql-go/graphql/federation"
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
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.RequiresAppliedDirective("totalProductsCreated yearsOfEmployment"),
			},
		},
		"email": &graphql.Field{
			Type: graphql.NewNonNull(graphql.ID),
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.ExternalAppliedDirective,
			},
		},
		"name": &graphql.Field{
			Type: graphql.String,
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.OverrideAppliedDirective("users"),
			},
		},
		"totalProductsCreated": &graphql.Field{
			Type: graphql.Int,
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.ExternalAppliedDirective,
			},
		},
		"yearsOfEmployment": &graphql.Field{
			Type: graphql.NewNonNull(graphql.Int),
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.ExternalAppliedDirective,
			},
		},
	},
	AppliedDirectives: []*graphql.AppliedDirective{
		federation.KeyAppliedDirective("email", true),
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
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.InaccessibleAppliedDirective,
			},
		},
	},
	AppliedDirectives: []*graphql.AppliedDirective{
		federation.ShareableAppliedDirective,
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
	AppliedDirectives: []*graphql.AppliedDirective{
		federation.KeyAppliedDirective("study { caseNumber }", true),
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
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.ProvidesAppliedDirective("totalProductsCreated"),
			},
		},
		"notes": &graphql.Field{
			Type: graphql.String,
			AppliedDirectives: []*graphql.AppliedDirective{
				federation.TagAppliedDirective("internal"),
			},
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
	AppliedDirectives: []*graphql.AppliedDirective{
		federation.KeyAppliedDirective("id", true),
		federation.KeyAppliedDirective("sku package", true),
		federation.KeyAppliedDirective("sku variation { id }", true),
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
	AppliedDirectives: []*graphql.AppliedDirective{
		federation.KeyAppliedDirective("sku package", true),
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
	},
})

var schema, _ = federation.NewFederatedSchema(federation.FederatedSchemaConfig{
	EntitiesFieldResolver: func(p graphql.ResolveParams) (interface{}, error) {
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
						}
					} else {
						panic("Invalid entity representation - missing __typename")
					}
				}
			}
		}
		return results, nil
	},
	EntityTypeResolver: func(p graphql.ResolveTypeParams) *graphql.Object {
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
		return nil
	},
	SchemaConfig: graphql.SchemaConfig{
		Query: rootQuery,
		Types: []graphql.Type{
			userType,
		},
	},
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
