import { productsResearch } from './data';

export default function Resolver(_, args) {
  for (const research of productsResearch) {
    if (research.study.caseNumber == args.study.caseNumber) {
      return research;
    }
  }
  return null;
}
