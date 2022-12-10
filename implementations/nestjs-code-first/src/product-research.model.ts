import { Directive, Field, ObjectType } from "@nestjs/graphql";

import { CaseStudy } from "./case-study.model";

@ObjectType()
@Directive('@key(fields: "study { caseNumber }")')
export class ProductResearch {
  @Field((type) => CaseStudy)
  study: CaseStudy;

  @Field({ nullable: true })
  outcome?: string;
}
