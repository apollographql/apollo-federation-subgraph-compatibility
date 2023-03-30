package graphql.kickstart.federation.compatibility.resolvers;

import graphql.kickstart.federation.compatibility.model.Product;
import graphql.kickstart.federation.compatibility.model.ProductResearch;
import java.util.HashMap;
import java.util.Map;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Component;

@Component
public class ProductResearchReferenceResolver {

    public static ProductResearch resolveReference(@NotNull Map<String, Object> reference) {
        if (reference.get("study") instanceof HashMap caseStudy) {
            if (caseStudy.get("caseNumber") instanceof String caseNumber) {
                return ProductResearch.RESEARCH_LIST.stream()
                        .filter(research -> research.study().caseNumber().equals(caseNumber))
                        .findAny()
                        .orElse(null);
            }
        }
        return null;
    }
}
