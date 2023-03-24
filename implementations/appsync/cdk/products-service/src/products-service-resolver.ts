import { AppSyncResolverEvent } from 'aws-lambda';

const totalProductsCreated = 1337;
const yearsOfEmployment = 10;

const dimension = {
  size: "small",
  weight: 1,
  unit: "kg"
};

const user = {
  averageProductsCreatedPerYear: totalProductsCreated ?? Math.round(totalProductsCreated / yearsOfEmployment),
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337,
  yearsOfEmployment: 10
 };

 const deprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
  createdBy: user
};

const productsResearch = [
  {
    study: {
      caseNumber: "1234",
      description: "Federation Study"
    },
    outcome: null
  },
  {
    study: {
      caseNumber: "1235",
      description: "Studio Study"
    },
    outcome: null
  },
];

const products = [
  {
    id: "apollo-federation",
    sku: "federation",
    package: "@apollo/federation",
    variation: {
      id: "OSS"
    },
    dimensions: dimension,
    research: [productsResearch[0]],
    createdBy: user,
    notes: null
  },
  {
    id: "apollo-studio",
    sku: "studio",
    package: "",
    variation: {
      id: "platform"
    },
    dimensions: dimension,
    research: [productsResearch[1]],
    createdBy: user,
    notes: null
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
          result = { email: 'support@apollographql.com', name: 'Jane Smith', totalProductsCreated: 1337 };
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

          // "representations": [
          //       {
          //         "__typename": "User",
          //         "email": "support@apollographql.com"
          //     }
          // ]
          for (const representation of representations as [any]) {
            switch (representation["__typename"]) {
              case 'User':
                entities.push({...user, __typename: 'User'});
                break;
              case 'DeprecatedProduct':
                entities.push({...deprecatedProduct, __typename: 'DeprecatedProduct'});
                break;
              case 'Product':
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
                break;
              case 'ProductResearch':
                  const filteredProductResearch = productsResearch.find((p: any) => {
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
      
                entities.push({ ...filteredProductResearch, __typename: 'ProductResearch' });
                break;
            }
          }
          result = entities;
          break;
      }
      break;
  }
  console.log(`returning ${JSON.stringify(result)}`);
  return result;
};
