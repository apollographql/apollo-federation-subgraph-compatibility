package com.example.demo.model

import com.expediagroup.graphql.generator.federation.directives.FieldSet
import com.expediagroup.graphql.generator.federation.directives.KeyDirective
import com.expediagroup.graphql.generator.federation.execution.FederatedTypeResolver
import com.expediagroup.graphql.generator.scalars.ID
import graphql.schema.DataFetchingEnvironment
import org.springframework.stereotype.Component

val FEDERATION_RESEARCH = ProductResearch(CaseStudy(ID("1234"), "Federation Study"))
val STUDIO_RESEARCH = ProductResearch(CaseStudy(ID("1235"), "Studio Study"))
val RESEARCH_LIST = listOf(FEDERATION_RESEARCH, STUDIO_RESEARCH)

/*
type ProductResearch @key(fields: "study { caseNumber }") {
  study: CaseStudy!
  outcome: String
}
 */
@KeyDirective(fields = FieldSet("study { caseNumber }"))
data class ProductResearch(
    val study: CaseStudy,
    val outcome: String? = null
)

@Component
class ProductResearchResolver : FederatedTypeResolver<ProductResearch> {
    override val typeName: String = "ProductResearch"

    override suspend fun resolve(
        environment: DataFetchingEnvironment,
        representations: List<Map<String, Any>>
    ): List<ProductResearch?> {
        return representations.map {
            val study = it["study"]
            val caseNumber = if (study is Map<*, *>) {
                study["caseNumber"].toString()
            } else {
                null
            }
            RESEARCH_LIST.find { research -> research.study.caseNumber.value == caseNumber }
        }
    }
}
