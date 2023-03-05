import { readFileSync } from 'fs';
import {
  parse,
  DocumentNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NonNullTypeNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  TypeNode,
} from 'graphql';
import { resolve } from 'path';

const productsRaw = readFileSync(
  resolve(__dirname, '../../products.graphql'),
  'utf-8',
);
const productsReferenceSchema = parse(productsRaw);

function findObjectTypeDefinition(
  document: DocumentNode,
  typeName: string,
): any | null {
  return document.definitions.find(
    (d) => d.kind == 'ObjectTypeDefinition' && d.name.value === typeName,
  ) as any;
}

function findObjectTypeExtensionDefinition(
  document: DocumentNode,
  typeName: string,
): any | null {
  return document.definitions.find(
    (d) => d.kind == 'ObjectTypeExtension' && d.name.value === typeName,
  ) as any;
}

function isListReturnType(type: TypeNode | null): boolean {
  return type?.kind === 'ListType';
}

function isNonNullReturnType(type: TypeNode | null): boolean {
  return type?.kind === 'NonNullType';
}

function unwrapReturnType(type: TypeNode) {
  if (isNonNullReturnType(type)) {
    return unwrapReturnType((type as NonNullTypeNode).type);
  } else if (isListReturnType(type)) {
    return unwrapReturnType((type as ListTypeNode).type);
  } else {
    return (type as NamedTypeNode)?.name?.value;
  }
}

function compareType(
  typeName: string,
  actualType: ObjectTypeDefinitionNode | ObjectTypeExtensionNode | null,
  expectedType: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
): string {
  let errors: string = '';
  if (actualType === null || actualType === undefined) {
    errors += `\n * target schema does not define ${typeName} type`;
  } else {
    errors += compareTypeFields(
      typeName,
      actualType.fields,
      expectedType.fields,
    );
  }
  return errors;
}

function compareTypeFields(
  typeName: String,
  fields: ReadonlyArray<FieldDefinitionNode>,
  expectedFields: ReadonlyArray<FieldDefinitionNode>,
): string {
  let errors: string = '';
  expectedFields.forEach((expectedField) => {
    const matchedField = fields.find(
      (f) => f.name.value == expectedField.name.value,
    ) as FieldDefinitionNode;

    if (matchedField === null || matchedField === undefined) {
      errors += `\n * ${typeName} type does not declare ${expectedField.name.value} field`;
    } else {
      errors += compareNode(
        typeName,
        expectedField.name.value,
        matchedField.type,
        expectedField.type,
      );
      if (expectedField.arguments) {
        if (!matchedField.arguments) {
          errors += `\n * ${typeName} does not define arguments on ${expectedField.name.value}`;
        }
        errors += compareArguments(
          expectedField.name.value,
          matchedField.arguments,
          expectedField.arguments,
        );
      }
    }
  });
  return errors;
}

function compareNode(
  parentType: String,
  fieldName: String,
  actual: TypeNode,
  expected: TypeNode,
): string {
  let errors: string = '';
  const expectedNonNullable = isNonNullReturnType(expected);
  if (isNonNullReturnType(actual) === expectedNonNullable) {
    if (expectedNonNullable) {
      errors += compareNode(
        parentType,
        fieldName,
        (actual as NonNullTypeNode).type,
        (expected as NonNullTypeNode).type,
      );
      return errors;
    }
  } else if (expectedNonNullable) {
    errors += `\n * ${parentType} defines different nullability for ${fieldName} field, expected non-nullable but was nullable`;
    errors += compareNode(
      parentType,
      fieldName,
      actual,
      (expected as NonNullTypeNode).type,
    );
    return errors;
  } else {
    errors += `\n * ${parentType} defines different nullability for ${fieldName} field, expected nullable but was non-nullable`;
    errors += compareNode(
      parentType,
      fieldName,
      (actual as NonNullTypeNode).type,
      expected,
    );
    return errors;
  }

  const expectedListReturnType = isListReturnType(expected);
  if (isListReturnType(actual) === expectedListReturnType) {
    if (expectedListReturnType) {
      errors += compareNode(
        parentType,
        fieldName,
        (actual as ListTypeNode).type,
        (expected as ListTypeNode).type,
      );
      return errors;
    }
  } else if (expectedListReturnType) {
    errors += `\n * ${parentType} defines different return type for ${fieldName} field, was expecting a list return type`;
    errors += compareNode(
      parentType,
      fieldName,
      actual,
      (expected as ListTypeNode).type,
    );
    return errors;
  } else {
    errors += `\n * ${parentType} defines different return type for ${fieldName} field, did not expect a list return type`;
    errors += compareNode(
      parentType,
      fieldName,
      (actual as ListTypeNode).type,
      expected,
    );
    return errors;
  }

  if (unwrapReturnType(actual) !== unwrapReturnType(expected)) {
    errors += `\n * ${parentType} defines different return type for ${fieldName} field, expected ${unwrapReturnType(
      expected,
    )} but was ${unwrapReturnType(actual)}`;
  }
  return errors;
}

function compareArguments(
  fieldName: String,
  actual: ReadonlyArray<InputValueDefinitionNode>,
  expected: ReadonlyArray<InputValueDefinitionNode>,
): string {
  let errors: string = '';
  expected.forEach((expectedArg) => {
    const matchedArg = actual.find(
      (arg) => arg.name.value == expectedArg.name.value,
    ) as InputValueDefinitionNode;

    if (matchedArg === null || matchedArg === undefined) {
      errors += `\n * ${fieldName} type does not declare ${expectedArg.name.value} argument`;
    } else {
      errors += compareNode(
        fieldName,
        expectedArg.name.value,
        matchedArg.type,
        expectedArg.type,
      );
    }
  });
  return errors;
}

export function compareSchemas(schemaToCompare: string): boolean {
  const schemaDefinition = parse(schemaToCompare);
  let errors: string = '';

  const typesToCompare = [
    'CaseStudy',
    'DeprecatedProduct',
    'Product',
    'ProductDimension',
    'ProductResearch',
    'ProductVariation',
  ];

  typesToCompare.forEach((typeName) => {
    const expectedDefinition = findObjectTypeDefinition(
      productsReferenceSchema,
      typeName,
    );
    const actualDefinition = findObjectTypeDefinition(
      schemaDefinition,
      typeName,
    );
    errors += compareType(typeName, actualDefinition, expectedDefinition);
  });

  // compare User type extension
  const expectedUserExtensionDefinition =
    findObjectTypeExtensionDefinition(productsReferenceSchema, 'User') ??
    findObjectTypeDefinition(productsReferenceSchema, 'User');
  const actualUserExtensionDefinition =
    findObjectTypeExtensionDefinition(schemaDefinition, 'User') ??
    findObjectTypeDefinition(schemaDefinition, 'User');
  errors += compareType(
    'User',
    actualUserExtensionDefinition,
    expectedUserExtensionDefinition,
  );

  // compare query fields
  const expectedQueryDefinition =
    findObjectTypeExtensionDefinition(productsReferenceSchema, 'Query') ??
    findObjectTypeDefinition(productsReferenceSchema, 'Query');
  const actualQueryDefinition =
    findObjectTypeExtensionDefinition(schemaDefinition, 'Query') ??
    findObjectTypeDefinition(schemaDefinition, 'Query');
  const queryFields = actualQueryDefinition.fields.filter((field) => {
    return ['product', 'deprecatedProduct'].includes(field.name.value);
  });
  errors += compareTypeFields(
    'Query',
    queryFields,
    expectedQueryDefinition.fields,
  );

  expect(errors).toBe('');
  return true;
}
