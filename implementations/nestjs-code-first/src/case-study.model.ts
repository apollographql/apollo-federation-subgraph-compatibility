import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class CaseStudy {
  @Field((type) => ID)
  caseNumber: string;

  @Field({ nullable: true })
  description?: string;
}
