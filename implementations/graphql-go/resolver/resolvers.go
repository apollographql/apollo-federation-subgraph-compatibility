package resolver

import (
	"math"

	"graphql-go-compatibility/model"
)

func FindDeprecatedProductBySkuAndPackage(sku string, packageArg string) (*model.DeprecatedProduct, error) {
	for i := range deprecatedProducts {
		if deprecatedProducts[i].Sku == sku && deprecatedProducts[i].Package == packageArg {
			return deprecatedProducts[i], nil
		}
	}
	return nil, nil
}

func FindProductById(id string) (*model.Product, error) {
	for i := range products {
		if products[i].ID == id {
			return products[i], nil
		}
	}
	return nil, nil
}

func FindProductBySkuAndPackage(sku string, packageArg string) (*model.Product, error) {
	for i := range products {
		if *products[i].Sku == sku && *products[i].Package == packageArg {
			return products[i], nil
		}
	}
	return nil, nil
}

func FindProductBySkuAndVariationID(sku string, variationID string) (*model.Product, error) {
	for i := range products {
		if *products[i].Sku == sku && products[i].Variation.ID == variationID {
			return products[i], nil
		}
	}
	return nil, nil
}

func FindProductResearchByProductId(product *model.Product) ([]*model.ProductResearch, error) {
	switch product.ID {
	case "apollo-federation":
		return research[:1], nil
	case "apollo-studio":
		return research[1:], nil
	default:
		return nil, nil
	}
}

func CalculateAverageProductsCreatedPerYear(user *model.User) (*int, error) {
	if user.TotalProductsCreated == nil {
		return nil, nil
	}
	var avgProductsCreated = int(math.Round(float64(*user.TotalProductsCreated) / float64(user.YearsOfEmployment)))
	return &avgProductsCreated, nil
}

// entity resolvers

// @key(fields: "sku package")
func DeprecatedProductEntityResolver(params map[string]interface{}) (*model.DeprecatedProduct, error) {
	sku, skuOk := params["sku"].(string)
	pkg, pkgOk := params["package"].(string)
	if skuOk && pkgOk {
		return FindDeprecatedProductBySkuAndPackage(sku, pkg)
	}
	return nil, nil
}

// @key(fields: "id")
// @key(fields: "sku package")
// @key(fields: "sku variation { id }")
func ProductEntityResolver(params map[string]interface{}) (*model.Product, error) {
	id, ok := params["id"].(string)
	if ok {
		return FindProductById(id)
	} else {
		sku, skuOk := params["sku"].(string)
		if skuOk {
			pkg, pkgOk := params["package"].(string)
			if pkgOk {
				return FindProductBySkuAndPackage(sku, pkg)
			} else {
				variation, varOk := params["variation"].(map[string]interface{})
				if varOk {
					varId, varIdOk := variation["id"].(string)
					if varIdOk {
						return FindProductBySkuAndVariationID(sku, varId)
					}
				}
			}
		}
	}
	return nil, nil
}

// @key(fields: "study { caseNumber }")
func ProductResearchEntityResolver(params map[string]interface{}) (*model.ProductResearch, error) {
	study, ok := params["study"].(map[string]interface{})
	if ok {
		caseNumber, caseOk := study["caseNumber"].(string)
		if caseOk {
			for i := range research {
				if research[i].Study.CaseNumber == caseNumber {
					return research[i], nil
				}
			}
		}
	}
	return nil, nil
}

// @key(fields: "email")
func UserEntityResolver(params map[string]interface{}) (*model.User, error) {
	email, ok := params["email"].(string)
	if ok {
		for i := range users {
			var user *model.User
			if users[i].Email == email {
				user = users[i]
			}

			totalProducts, totalSpecified := params["totalProductsCreated"].(float64)
			if totalSpecified {
				total := int(totalProducts)
				user.TotalProductsCreated = &total
			}

			yearsOfEmployment, yearsSpecified := params["yearsOfEmployment"].(float64)
			if yearsSpecified {
				user.YearsOfEmployment = int(yearsOfEmployment)
			}

			if user != nil {
				return user, nil
			}
		}
	}
	return nil, nil
}
