import { ApolloServer } from '@apollo/server';
import { printSubgraphSchema } from '@apollo/subgraph';
import { startStandaloneServer } from '@apollo/server/standalone';
import SchemaBuilder from '@pothos/core';
import DirectivesPlugin from '@pothos/plugin-directives';
import FederationPlugin from '@pothos/plugin-federation';

const serverPort = parseInt(process.env.PRODUCTS_PORT || "") || 4001;

const builder = new SchemaBuilder<{
  DefaultFieldNullability: true;
}>({
  plugins: [DirectivesPlugin, FederationPlugin],
  useGraphQLToolsUnorderedDirectives: true,
  defaultFieldNullability: true,
});

interface Product {
  id: string;
  sku: string;
  package: string;
  variation: string;
}

interface ProductResearch {
  study: CaseStudy
  outcome?: string
}

interface CaseStudy {
  caseNumber: string;
  description: string;
}

interface DeprecatedProduct {
  sku: string
  package: string
  reason?: string
}

interface User {
  email: string
  name: string
  totalProducts: number
}

const deprecatedProduct: DeprecatedProduct = {
  sku: "apollo-federation-v1",
  package: "@apollo/federation-v1",
  reason: "Migrate to Federation V2",
};

const products: Product[] = [
  {
    id: 'apollo-federation',
    sku: 'federation',
    package: '@apollo/federation',
    variation: 'OSS',
  },
  {
    id: 'apollo-studio',
    sku: 'studio',
    package: '',
    variation: 'platform',
  },
];

const productResearch: ProductResearch[] = [
  {
    study: {
      caseNumber: "1234",
      description: "Federation Study"
    }
  },
  {
    study: {
      caseNumber: "1235",
      description: "Studio Study"
    }
  }
]
const user = {
  email: "support@apollographql.com",
  name: "Jane Smith",
  totalProductsCreated: 1337
};

const DeprecatedProduct = builder.objectRef<DeprecatedProduct>('DeprecatedProduct').implement({
  fields: t => ({
    sku: t.exposeString('sku', { nullable: false }),
    package: t.exposeString('package', { nullable: false }),
    reason: t.exposeString('reason'),
    createdBy: t.field({
      type: User,
      resolve: () => user,
    })
  })
});

builder.asEntity(DeprecatedProduct, {
  key: builder.selection<{ sku: string, package: string }>('sku package'),
  resolveReference: async (reference) => {
    if (reference.sku === deprecatedProduct.sku && reference.package === deprecatedProduct.package) {
      return deprecatedProduct;
    } else {
      return null;
    }
  }
})

const ProductResearch = builder.objectRef<ProductResearch>('ProductResearch').implement({
  fields: (t) => ({
    study: t.expose('study',{
      type: CaseStudy,
      nullable: false,
    }),
    outcome: t.exposeString('outcome', { nullable: true }),
  }),
});

builder.asEntity(ProductResearch, {
  key: builder.selection<{ study: { caseNumber: string } }>('study { caseNumber }'),
  resolveReference: async (reference) => productResearch.find(
    (p) => reference.study.caseNumber === p.study.caseNumber
  )
})

const CaseStudy = builder.objectRef<CaseStudy>('CaseStudy').implement({
  fields: (t) => ({
    caseNumber: t.exposeID('caseNumber', { nullable: false }),
    description: t.exposeString('description')
  }),
});

const ProductVariation = builder.objectRef<{ id: string }>('ProductVariation').implement({
  fields: (t) => ({
    id: t.exposeID('id', { nullable: false }),
  }),
});

const ProductDimension = builder
  .objectRef<{ size: string; weight: number; unit: string }>('ProductDimension')
  .implement({
    shareable: true,
    fields: (t) => ({
      size: t.exposeString('size'),
      weight: t.exposeFloat('weight'),
      unit: t.exposeString('unit', {
        inaccessible: true,
      }),
    }),
  });

const ProductType = builder.objectRef<Product>('Product').implement({
  fields: (t) => ({
    id: t.exposeID('id', {
      nullable: false,
    }),
    sku: t.exposeString('sku'),
    package: t.string({
      resolve: (product) => product.package
    }),
    dimensions: t.field({
      type: ProductDimension,
      resolve: () => ({ size: 'small', weight: 1, unit: 'kg' }),
    }),
    variation: t.field({
      type: ProductVariation,
      resolve: (product) => ({ id: product.variation }),
    }),
    notes: t.string({
      tag: 'internal',
      resolve: () => 'This is a note',
    }),
    createdBy: t.field({
      type: User.provides<{
        totalProductsCreated: number
      }>('totalProductsCreated'),
      nullable: true,
      resolve: () => user,
    }),
    research: t.field({
      type: [ProductResearch],
      nullable: false,
      resolve: () => productResearch,
    })
  }),
});

const User = builder
  .externalRef('User', builder.selection<{ email: string }>('email'), (key) => key)
  .implement({
    externalFields: (t) => ({
      email: t.id({ nullable: false }),
      totalProductsCreated: t.int(),
      yearsOfEmployment: t.int({ nullable: false })
    }),
    fields: (t) => ({
      name: t.string({
        override: { from: 'users' },
        resolve: () => 'Jane Smith',
      }),
      averageProductsCreatedPerYear: t.int({
        requires: builder.selection<{totalProductsCreated: number, yearsOfEmployment: number}>(
          'totalProductsCreated yearsOfEmployment'
        ),
        resolve: (parent) => Math.round(parent.totalProductsCreated / parent.yearsOfEmployment),
      })
    }),
  });

builder.asEntity(ProductType, {
  key:  [
    builder.selection<{ id: string }>('id'),
    builder.selection<{ sku: string; package: string }>('sku package'),
    builder.selection<{
      sku: string;
      variation: {
        id: string;
      };
    }>('sku variation { id }'),
  ],
  resolveReference: (key) => {
    if ('id' in key) {
      return products.find((product) => product.id === key.id);
    }
    if ('variation' in key) {
      return products.find(
        (product) => product.sku === key.sku && product.variation === key.variation.id,
      );
    }

    return products.find((product) => product.sku === key.sku && product.package === key.package);
  },
});

builder.queryType({
  fields: (t) => ({
    product: t.field({
      type: ProductType,
      nullable: true,
      args: {
        id: t.arg.id({ required: true }),
      },
      resolve: (root, args) => products.find((product) => product.id === args.id),
    }),
    deprecatedProduct: t.field({
      type: DeprecatedProduct,
      deprecationReason: 'Use product query instead',
      args: {
        sku: t.arg.string({ required: true }),
        package: t.arg.string({ required: true }),
      },
      resolve: () => deprecatedProduct,
    }),
  }),
});

export const schema = builder.toSubGraphSchema({
  linkUrl: "https://specs.apollo.dev/federation/v2.1"
});

console.log(printSubgraphSchema(schema));

const server = new ApolloServer({
  schema,
});

startStandaloneServer(server, {
  listen: { port: serverPort },
}).then(({ url }) => console.log(`🚀  Products subgraph ready at ${url}`));
