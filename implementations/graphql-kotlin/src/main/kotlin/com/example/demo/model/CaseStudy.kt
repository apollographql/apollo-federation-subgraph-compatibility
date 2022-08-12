package com.example.demo.model

import com.expediagroup.graphql.generator.scalars.ID

/*
type CaseStudy {
  caseNumber: ID!
  description: String
}
 */
data class CaseStudy(
    val caseNumber: ID,
    val description: String?
)