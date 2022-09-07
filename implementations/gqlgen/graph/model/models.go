package model

type User struct {
	// AverageProductsCreatedPerYear *int    `json:"averageProductsCreatedPerYear"`
	Email                string  `json:"email"`
	Name                 *string `json:"name"`
	TotalProductsCreated *int    `json:"totalProductsCreated"`
	YearsOfEmployment    int     `json:"yearsOfEmployment"`
}

func (User) IsEntity() {}
