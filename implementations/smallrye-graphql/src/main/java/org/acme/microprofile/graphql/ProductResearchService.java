package org.acme.microprofile.graphql;

import jakarta.enterprise.context.ApplicationScoped;
import java.util.HashMap;
import java.util.Map;

@ApplicationScoped
public class ProductResearchService {

  public static ProductResearch resolveReference(Map<String, Object> reference) {
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