package com.netflix.graphql.dgs.compatibility.datafetchers;

import com.netflix.graphql.dgs.DgsComponent;
import com.netflix.graphql.dgs.DgsEntityFetcher;
import com.netflix.graphql.dgs.compatibility.model.ProductResearch;
import java.util.HashMap;
import java.util.Map;
import org.jetbrains.annotations.NotNull;

@DgsComponent
public class ProductResearchDataFetcher {

  @DgsEntityFetcher(name = "ProductResearch")
  public static ProductResearch resolveReference(@NotNull Map<String, Object> reference) {
    if (reference.get("study") instanceof HashMap caseStudy) {
      if (caseStudy.get("caseNumber") instanceof String caseNumber) {
        return ProductResearch.RESEARCH_LIST.stream()
                .filter(research -> research.getStudy().getCaseNumber().equals(caseNumber))
                .findAny()
                .orElse(null);
      }
    }
    return null;
  }
}