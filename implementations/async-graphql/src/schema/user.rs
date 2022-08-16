// use async_graphql::*;
use async_graphql::{ComplexObject, Context, Object, SimpleObject, ID};

#[derive(SimpleObject)]
#[graphql(complex, extends)]
pub struct User {
    #[graphql(external)]
    pub email: ID,

    pub name: Option<String>,

    #[graphql(external)]
    pub total_products_created: Option<i32>,

    #[graphql(external)]
    pub years_of_employment: i32,
}

#[ComplexObject]
impl User {
    #[graphql(requires = "totalProductsCreated yearsOfEmployment")]
    pub async fn average_products_created_per_year(&self) -> Option<i32> {
		dbg!(&self.total_products_created, &self.years_of_employment);

        self.total_products_created
            .and_then(|products_created| Some(products_created / self.years_of_employment))
    }
}

impl Default for User {
    fn default() -> Self {
        User {
            name: Some("Jane Smith".to_string()),
            email: "support@apollographql.com".into(),
            total_products_created: Some(1337),
            years_of_employment: 10,
        }
    }
}

#[derive(Default)]
pub struct UserQuery;

#[Object]
impl UserQuery {
    #[graphql(entity)]
    async fn find_user_by_email<'a>(&self, _ctx: &'a Context<'_>, email: String) -> Option<User> {
        let mut user = User::default();
        user.email = email.into();
        Some(user)
    }
}
