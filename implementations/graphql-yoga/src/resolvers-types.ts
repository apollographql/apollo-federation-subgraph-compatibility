import { GraphQLResolveInfo } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  _FieldSet: { input: unknown; output: unknown; }
};

export type CaseStudy = {
  __typename?: 'CaseStudy';
  caseNumber: Scalars['ID']['output'];
  description?: Maybe<Scalars['String']['output']>;
};

export type DeprecatedProduct = {
  __typename?: 'DeprecatedProduct';
  createdBy?: Maybe<User>;
  package: Scalars['String']['output'];
  reason?: Maybe<Scalars['String']['output']>;
  sku: Scalars['String']['output'];
};

export type Inventory = {
  __typename?: 'Inventory';
  deprecatedProducts: Array<DeprecatedProduct>;
  id: Scalars['ID']['output'];
};

export type Product = {
  __typename?: 'Product';
  createdBy?: Maybe<User>;
  dimensions?: Maybe<ProductDimension>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  package?: Maybe<Scalars['String']['output']>;
  research: Array<ProductResearch>;
  sku?: Maybe<Scalars['String']['output']>;
  variation?: Maybe<ProductVariation>;
};

export type ProductDimension = {
  __typename?: 'ProductDimension';
  size?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
  weight?: Maybe<Scalars['Float']['output']>;
};

export type ProductResearch = {
  __typename?: 'ProductResearch';
  outcome?: Maybe<Scalars['String']['output']>;
  study: CaseStudy;
};

export type ProductVariation = {
  __typename?: 'ProductVariation';
  id: Scalars['ID']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** @deprecated Use product query instead */
  deprecatedProduct?: Maybe<DeprecatedProduct>;
  product?: Maybe<Product>;
};


export type QueryDeprecatedProductArgs = {
  package: Scalars['String']['input'];
  sku: Scalars['String']['input'];
};


export type QueryProductArgs = {
  id: Scalars['ID']['input'];
};

export type User = {
  __typename?: 'User';
  averageProductsCreatedPerYear?: Maybe<Scalars['Int']['output']>;
  email: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  totalProductsCreated?: Maybe<Scalars['Int']['output']>;
  yearsOfEmployment: Scalars['Int']['output'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ReferenceResolver<TResult, TReference, TContext> = (
      reference: TReference,
      context: TContext,
      info: GraphQLResolveInfo
    ) => Promise<TResult> | TResult;

      type ScalarCheck<T, S> = S extends true ? T : NullableCheck<T, S>;
      type NullableCheck<T, S> = Maybe<T> extends T ? Maybe<ListCheck<NonNullable<T>, S>> : ListCheck<T, S>;
      type ListCheck<T, S> = T extends (infer U)[] ? NullableCheck<U, S>[] : GraphQLRecursivePick<T, S>;
      export type GraphQLRecursivePick<T, S> = { [K in keyof T & keyof S]: ScalarCheck<T[K], S[K]> };
    

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping of federation types */
export type FederationTypes = {
  DeprecatedProduct: DeprecatedProduct;
  Inventory: Inventory;
  Product: Product;
  ProductResearch: ProductResearch;
  User: User;
};

/** Mapping of federation reference types */
export type FederationReferenceTypes = {
  DeprecatedProduct:
    ( { __typename: 'DeprecatedProduct' }
    & GraphQLRecursivePick<FederationTypes['DeprecatedProduct'], {"sku":true,"package":true}> );
  Inventory:
    ( { __typename: 'Inventory' }
    & GraphQLRecursivePick<FederationTypes['Inventory'], {"id":true}> );
  Product:
    ( { __typename: 'Product' }
    & ( GraphQLRecursivePick<FederationTypes['Product'], {"id":true}>
        | GraphQLRecursivePick<FederationTypes['Product'], {"sku":true,"package":true}>
        | GraphQLRecursivePick<FederationTypes['Product'], {"sku":true,"variation":{"id":true}}> ) );
  ProductResearch:
    ( { __typename: 'ProductResearch' }
    & GraphQLRecursivePick<FederationTypes['ProductResearch'], {"study":{"caseNumber":true}}> );
  User:
    ( { __typename: 'User' }
    & GraphQLRecursivePick<FederationTypes['User'], {"email":true}>
    & ( Record<PropertyKey, never>
        | GraphQLRecursivePick<FederationTypes['User'], {"totalProductsCreated":true,"yearsOfEmployment":true}> ) );
};



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  CaseStudy: ResolverTypeWrapper<CaseStudy>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  DeprecatedProduct: ResolverTypeWrapper<DeprecatedProduct>;
  Inventory: ResolverTypeWrapper<Inventory>;
  Product: ResolverTypeWrapper<Product>;
  ProductDimension: ResolverTypeWrapper<ProductDimension>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ProductResearch: ResolverTypeWrapper<ProductResearch>;
  ProductVariation: ResolverTypeWrapper<ProductVariation>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  User: ResolverTypeWrapper<User>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  CaseStudy: CaseStudy;
  ID: Scalars['ID']['output'];
  String: Scalars['String']['output'];
  DeprecatedProduct: DeprecatedProduct | FederationReferenceTypes['DeprecatedProduct'];
  Inventory: Inventory | FederationReferenceTypes['Inventory'];
  Product: Product | FederationReferenceTypes['Product'];
  ProductDimension: ProductDimension;
  Float: Scalars['Float']['output'];
  ProductResearch: ProductResearch | FederationReferenceTypes['ProductResearch'];
  ProductVariation: ProductVariation;
  Query: Record<PropertyKey, never>;
  User: User | FederationReferenceTypes['User'];
  Int: Scalars['Int']['output'];
  Boolean: Scalars['Boolean']['output'];
};

export type CustomDirectiveArgs = { };

export type CustomDirectiveResolver<Result, Parent, ContextType = any, Args = CustomDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type CaseStudyResolvers<ContextType = any, ParentType extends ResolversParentTypes['CaseStudy'] = ResolversParentTypes['CaseStudy']> = {
  caseNumber?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type DeprecatedProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['DeprecatedProduct'] = ResolversParentTypes['DeprecatedProduct'], FederationReferenceType extends FederationReferenceTypes['DeprecatedProduct'] = FederationReferenceTypes['DeprecatedProduct']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['DeprecatedProduct']> | FederationReferenceType, FederationReferenceType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  package?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sku?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type InventoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Inventory'] = ResolversParentTypes['Inventory'], FederationReferenceType extends FederationReferenceTypes['Inventory'] = FederationReferenceTypes['Inventory']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Inventory']> | FederationReferenceType, FederationReferenceType, ContextType>;
  deprecatedProducts?: Resolver<Array<ResolversTypes['DeprecatedProduct']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product'], FederationReferenceType extends FederationReferenceTypes['Product'] = FederationReferenceTypes['Product']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['Product']> | FederationReferenceType, FederationReferenceType, ContextType>;
  createdBy?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  dimensions?: Resolver<Maybe<ResolversTypes['ProductDimension']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  package?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  research?: Resolver<Array<ResolversTypes['ProductResearch']>, ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  variation?: Resolver<Maybe<ResolversTypes['ProductVariation']>, ParentType, ContextType>;
};

export type ProductDimensionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductDimension'] = ResolversParentTypes['ProductDimension']> = {
  size?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  unit?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  weight?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type ProductResearchResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductResearch'] = ResolversParentTypes['ProductResearch'], FederationReferenceType extends FederationReferenceTypes['ProductResearch'] = FederationReferenceTypes['ProductResearch']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['ProductResearch']> | FederationReferenceType, FederationReferenceType, ContextType>;
  outcome?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  study?: Resolver<ResolversTypes['CaseStudy'], ParentType, ContextType>;
};

export type ProductVariationResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariation'] = ResolversParentTypes['ProductVariation']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  deprecatedProduct?: Resolver<Maybe<ResolversTypes['DeprecatedProduct']>, ParentType, ContextType, RequireFields<QueryDeprecatedProductArgs, 'package' | 'sku'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User'], FederationReferenceType extends FederationReferenceTypes['User'] = FederationReferenceTypes['User']> = {
  __resolveReference?: ReferenceResolver<Maybe<ResolversTypes['User']> | FederationReferenceType, FederationReferenceType, ContextType>;
  averageProductsCreatedPerYear?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  name?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  totalProductsCreated?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  CaseStudy?: CaseStudyResolvers<ContextType>;
  DeprecatedProduct?: DeprecatedProductResolvers<ContextType>;
  Inventory?: InventoryResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductDimension?: ProductDimensionResolvers<ContextType>;
  ProductResearch?: ProductResearchResolvers<ContextType>;
  ProductVariation?: ProductVariationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  custom?: CustomDirectiveResolver<any, any, ContextType>;
};
