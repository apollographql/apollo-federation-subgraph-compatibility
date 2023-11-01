import { products } from './data';

export default function Resolver(_, args) {
  for (const product of products) {
    if (product.sku == args.sku && product.package == args.package) {
      return product;
    }
  }
  return null;
}
