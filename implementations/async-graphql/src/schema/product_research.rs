use async_graphql::{Context, InputObject, Object, SimpleObject, ID};

#[derive(InputObject)]
struct ProductResearchStudyCaseNumber {
    case_number: ID,
}

#[derive(SimpleObject, Clone, Debug)]
pub struct ProductResearch {
    pub study: CaseStudy,
    pub outcome: Option<String>,
}

#[derive(SimpleObject, Clone, Debug)]
pub struct CaseStudy {
    pub case_number: ID,
    pub description: Option<String>,
}

#[derive(Default)]
pub struct ProductResearchQuery;

#[Object]
impl ProductResearchQuery {
    #[graphql(entity)]
    async fn find_product_research_by_study_and_case_number<'a>(
        &self,
        ctx: &'a Context<'_>,
        study: ProductResearchStudyCaseNumber,
    ) -> Option<&'a ProductResearch> {
        let product_research = ctx.data_unchecked::<Vec<ProductResearch>>();
        product_research
            .iter()
            .find(|pr| pr.study.case_number == study.case_number)
    }
}
