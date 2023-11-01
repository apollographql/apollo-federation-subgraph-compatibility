import { deprecatedProduct } from './data';

export default function Resolver(_, args) {
  if (
    deprecatedProduct.package == args.package &&
    deprecatedProduct.sku == args.sku
  ) {
    return deprecatedProduct;
  }

  return null;
}
