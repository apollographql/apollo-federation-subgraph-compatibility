export default function Resolver(
  { totalProductsCreated, yearsOfEmployment },
  args,
) {
  if (totalProductsCreated) {
    return Math.round(totalProductsCreated / yearsOfEmployment);
  } else {
    return null;
  }
}
