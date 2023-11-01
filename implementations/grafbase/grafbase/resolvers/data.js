export const dimension = {
  size: 'small',
  weight: 1,
  unit: 'kg',
};

export const user = {
  email: 'support@apollographql.com',
  name: 'Jane Smith',
  totalProductsCreated: 1337,
  yearsOfEmployment: 10,
};

export const deprecatedProduct = {
  sku: 'apollo-federation-v1',
  package: '@apollo/federation-v1',
  reason: 'Migrate to Federation V2',
  createdBy: user,
};

export const productsResearch = [
  {
    study: {
      caseNumber: '1234',
      description: 'Federation Study',
    },
    outcome: null,
  },
  {
    study: {
      caseNumber: '1235',
      description: 'Studio Study',
    },
    outcome: null,
  },
];

export const products = [
  {
    id: 'apollo-federation',
    sku: 'federation',
    package: '@apollo/federation',
    variation: {
      id: 'OSS',
    },
    dimensions: dimension,
    research: [productsResearch[0]],
    createdBy: user,
    notes: null,
  },
  {
    id: 'apollo-studio',
    sku: 'studio',
    package: '',
    variation: {
      id: 'platform',
    },
    dimensions: dimension,
    research: [productsResearch[1]],
    createdBy: user,
    notes: null,
  },
];
