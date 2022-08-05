import { readFileSync } from "fs";
import { visit, parse, FieldDefinitionNode, NamedTypeNode, isNonNullType, NonNullTypeNode, TypeNode, InputValueDefinitionNode } from "graphql";
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

function isNonNullReturnType(type: TypeNode) {
  return type.kind === "NonNullType"
}

function getReturnTypeName(type: TypeNode) {
  if (isNonNullReturnType(type)) {
    return getReturnTypeName((type as NonNullTypeNode).type);
  } else {
    return (type as NamedTypeNode).name.value;
  }
}

function compareType(typeName: String, fields: ReadonlyArray<FieldDefinitionNode>, expectedFields: ReadonlyArray<FieldDefinitionNode>) {
  let errors: string = ""
  if (expectedFields.length !== fields.length) {
    errors += `\n * ${typeName} does not declare the same number of fields`;
  };
  expectedFields.forEach((expectedField) => {
    const matchedField = fields.find(
      (f) => f.name.value == expectedField.name.value
    ) as FieldDefinitionNode;

    if (matchedField === null || matchedField === undefined) {
      errors += `\n * ${typeName} type does not declare ${expectedField.name.value} field`;
    } else {
      errors += compareNode(typeName, expectedField.name.value, matchedField.type, expectedField.type);
      if (expectedField.arguments) {
        if (!matchedField.arguments) {
          errors += `\n * ${typeName} does not define arguments on ${expectedField.name.value}`;
        }
        errors += compareArguments(expectedField.name.value, matchedField.arguments, expectedField.arguments);
      }
    }
  });
  expect(errors).toBe("");
}

function compareNode(parentType: String, fieldName: String, type: TypeNode, expected: TypeNode) {
  let errors: string = "";
  if (isNonNullReturnType(type) !== isNonNullReturnType(expected)) {
    errors += `\n * ${parentType} defines different nullability for ${fieldName}, expected ${isNonNullType(expected) ? "nullable but was non-nullable" : "non-nullable but was nullable"}`;
  }
  if (getReturnTypeName(type) !== getReturnTypeName(expected)) {
    errors += `\n * ${parentType} defines different return type for ${fieldName}, expected ${getReturnTypeName(expected)} but was ${getReturnTypeName(type)}`;
  }
  return errors;
}

function compareArguments(fieldName: String, actual: ReadonlyArray<InputValueDefinitionNode>, expected: ReadonlyArray<InputValueDefinitionNode>) {
  let errors: string = "";
  expected.forEach((expectedArg) => {
    const matchedArg = actual.find(
      (arg) => arg.name.value == expectedArg.name.value
    ) as InputValueDefinitionNode;

    if (matchedArg === null || matchedArg === undefined) {
      errors += `\n * ${fieldName} type does not declare ${expectedArg.name.value} argument`;
    } else {
      errors += compareNode(fieldName, expectedArg.name.value, matchedArg.type, expectedArg.type);
    }
  });
  return errors;
}

export function compareSchemas(schemaToCompare: string) {
  visit(parse(schemaToCompare), {
    ObjectTypeExtension(node) {
      switch (node.name.value) {
        case "User":
          compareType(node.name.value, node.fields, userDefinition.fields);
          break;
      }
    },
    ObjectTypeDefinition(node) {
      switch (node.name.value) {
        case "Product":
          compareType(node.name.value, node.fields, productDefinition.fields);
          break;
        case "ProductDimension":
          compareType(node.name.value, node.fields, productDimensionDefinition.fields);
          break;
        case "ProductVariation":
          compareType(node.name.value, node.fields, productVariationDefinition.fields);
          break;
        case "Query":
          const queryFields = node.fields.filter((field) => {
            return !["_service", "_entities"].includes(field.name.value)
          });
          compareType(node.name.value, queryFields, queryDefinition.fields);
          break;
        case "User":
          compareType(node.name.value, node.fields, userDefinition.fields);
          break;
      }
    },
  });
  return true;
}
