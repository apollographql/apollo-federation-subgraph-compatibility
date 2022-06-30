import { readFileSync } from "fs";
import { visit, parse, BREAK } from "graphql";
import { resolve } from "path";

const productsRaw = readFileSync(
  resolve(
    __dirname,
    "..",
    "..",
    "implementations",
    "_template_library_",
    "products.graphql"
  ),
  "utf-8"
);
const productsReferenceSchema = parse(productsRaw);
const productDefinition = productsReferenceSchema.definitions.find(
  (d) => d.kind == "ObjectTypeDefinition" && d.name.value == "Product"
) as any;
const productDimensionDefinition = productsReferenceSchema.definitions.find(
  (d) => d.kind == "ObjectTypeDefinition" && d.name.value == "ProductDimension"
) as any;
const productVariationDefinition = productsReferenceSchema.definitions.find(
  (d) => d.kind == "ObjectTypeDefinition" && d.name.value == "ProductVariation"
) as any;
const queryDefinition = productsReferenceSchema.definitions.find(
  (d) => d.kind == "ObjectTypeExtension" && d.name.value == "Query"
) as any;
const userDefinition = productsReferenceSchema.definitions.find(
  (d) => d.kind == "ObjectTypeExtension" && d.name.value == "User"
) as any;

function matchFields(field: any, fieldToCompareTo: any) {
  if (!field ?? !fieldToCompareTo) return false;
  if (field?.type?.name?.value != fieldToCompareTo?.type?.name?.value)
    return false;

  return true;
}

export function compareSchemas(schemaToCompare: string) {
  let areSchemasTheSame = true;

  visit(parse(schemaToCompare), {
    ObjectTypeExtension(node) {
      switch (node.name.value) {
        case "User":
          node.fields.forEach((field) => {
            const matchedField = userDefinition.fields.find(
              (f) => f.name.value == field.name.value
            ) as any;

            areSchemasTheSame = matchFields(matchedField, field);
          });
          break;
      }
    },
    ObjectTypeDefinition(node) {
      switch (node.name.value) {
        case "Product":
          node.fields.forEach((field) => {
            const matchedField = productDefinition.fields.find(
              (f) => f.name.value == field.name.value
            ) as any;

            areSchemasTheSame = matchFields(matchedField, field);
          });
          break;
        case "ProductDimension":
          node.fields.forEach((field) => {
            const matchedField = productDimensionDefinition.fields.find(
              (f) => f.name.value == field.name.value
            ) as any;

            areSchemasTheSame = matchFields(matchedField, field);
          });
          break;
        case "ProductVariation":
          node.fields.forEach((field) => {
            const matchedField = productVariationDefinition.fields.find(
              (f) => f.name.value == field.name.value
            ) as any;

            areSchemasTheSame = matchFields(matchedField, field);
          });
          break;
        case "Query":
          node.fields.forEach((field) => {
            if (!["_service", "_entities"].includes(field.name.value)) {
              const matchedField = queryDefinition.fields.find(
                (f) => f.name.value == field.name.value
              ) as any;

              areSchemasTheSame = matchFields(matchedField, field);
            }
          });
          break;
        case "User":
          node.fields.forEach((field) => {
            const matchedField = userDefinition.fields.find(
              (f) => f.name.value == field.name.value
            ) as any;

            areSchemasTheSame = matchFields(matchedField, field);
          });
          break;
      }

      if (!areSchemasTheSame) return BREAK;
    },
  });

  return areSchemasTheSame;
}
