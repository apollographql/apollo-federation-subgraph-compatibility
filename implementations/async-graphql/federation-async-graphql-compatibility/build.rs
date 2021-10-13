use std::env;
use std::fs;
use std::path::Path;
use product_graphql::create_schema;

fn main() {
    let out_dir = env::var_os("OUT_DIR").unwrap();
    let dest_path = Path::new(&out_dir).join("products.graphql");
    let schema = create_schema();

    fs::write(&dest_path, schema.federation_sdl()).unwrap();

    println!("cargo:rerun-if-changed=src/src/graphql.rs");
    println!("cargo:rerun-if-changed=src/endpoints.rs");
    println!("cargo:rerun-if-changed=build.rs");
}
