import { AppSyncResolverEvent } from 'aws-lambda';

const products = [
  {
    id: 'apollo-federation',
    sku: 'federation',
    package: '@apollo/federation',
    variation: { id: 'OSS' },
    dimensions: { size: 'small', weight: 1 },
  },
  {
    id: 'apollo-studio',
    sku: 'studio',
    package: '',
    variation: { id: 'platform' },
  },
];

// Handler resolving the entities from representations argument
export const handler = async (event: AppSyncResolverEvent<any>) => {
  console.log(`event ${JSON.stringify(event)}`);

  let result: any = [];
  switch (event.info.parentTypeName) {
    case 'Product':
      console.log(`dealing with product and field ${event.info.fieldName}`);
      switch (event.info.fieldName) {
        case 'createdBy':
          result = { email: 'support@apollographql.com', name: 'Apollo Studio Support', totalProductsCreated: 1337 };
          break;
      }
      break;
    case 'Query':
      switch (event.info.fieldName) {
        case 'product':
          if (event.arguments.id) result = products.find((p) => p.id === event.arguments.id);
          if (event.arguments.sku && event.arguments.package)
            result = products.find((p) => p.sku === event.arguments.sku && p.package === event.arguments.package);
          if (event.arguments.sku && event.arguments.variation && event.arguments.variation.id)
            result = products.find(
              (p) => p.sku === event.arguments.sku && p.variation.id === event.arguments.variation.id
            );
          break;
        case '_service':
          result = { sdl: process.env.SCHEMA };
          break;
        case '__typename':
          // Not sufficient : need capability to set extensions ...
          result = { ftv1: 'test' };
          break;
        case '_entities':
          const { representations } = event.arguments;
          const entities: any[] = [];

          for (const representation of representations as [any]) {
            const filteredProduct = products.find((p: any) => {
              for (const key of Object.keys(representation)) {
                if (typeof representation[key] != 'object' && key != '__typename' && p[key] != representation[key]) {
                  return false;
                } else if (typeof representation[key] == 'object') {
                  for (const subkey of Object.keys(representation[key])) {
                    if (
                      typeof representation[key][subkey] != 'object' &&
                      p[key][subkey] != representation[key][subkey]
                    ) {
                      return false;
                    }
                  }
                }
              }
              return true;
            });

            entities.push({ ...filteredProduct, __typename: 'Product' });
          }
          result = entities;
          break;
      }
      break;
  }
  console.log(`returning ${JSON.stringify(result)}`);
  return result;
};
