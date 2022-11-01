package model

type User struct {
	// AverageProductsCreatedPerYear *int    `json:"averageProductsCreatedPerYear"`
	Email                string  `json:"email"`
	Name                 *string `json:"name"`
	TotalProductsCreated *int    `json:"totalProductsCreated"`
	YearsOfEmployment    int     `json:"yearsOfEmployment"`
}

type CaseStudy struct {
	CaseNumber  string  `json:"caseNumber"`
	Description *string `json:"description"`
}

type DeprecatedProduct struct {
	Sku       string  `json:"sku"`
	Package   string  `json:"package"`
	Reason    *string `json:"reason"`
	CreatedBy *User   `json:"createdBy"`
}

type Product struct {
	ID         string             `json:"id"`
	Sku        *string            `json:"sku"`
	Package    *string            `json:"package"`
	Variation  *ProductVariation  `json:"variation"`
	Dimensions *ProductDimension  `json:"dimensions"`
	CreatedBy  *User              `json:"createdBy"`
	Notes      *string            `json:"notes"`
	Research   []*ProductResearch `json:"research"`
}

type ProductDimension struct {
	Size   *string  `json:"size"`
	Weight *float64 `json:"weight"`
	Unit   *string  `json:"unit"`
}

type ProductResearch struct {
	Study   *CaseStudy `json:"study"`
	Outcome *string    `json:"outcome"`
}

type ProductVariation struct {
	ID string `json:"id"`
}
