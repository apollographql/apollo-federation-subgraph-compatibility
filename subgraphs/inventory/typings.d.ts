export interface ProductReference {
  id: string;
  dimensions: ProductDimension;
}

export interface ProductDimension {
  size: string;
  weight: number;
}
