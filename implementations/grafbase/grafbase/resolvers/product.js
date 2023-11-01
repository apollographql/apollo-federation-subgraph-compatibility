import { products } from './data';

export default function Resolver(_, { id }) {
  for (const product of products) {
    if (product.id == id) {
      return product;
    }
  }
  return null;
}
