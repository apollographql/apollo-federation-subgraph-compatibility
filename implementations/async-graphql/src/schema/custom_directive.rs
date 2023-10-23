use async_graphql::TypeDirective;

#[TypeDirective(
    location = "Object",
    composable = "https://myspecs.dev/myCustomDirective/v1.0",
)]
pub fn custom(){}