package graphql.kickstart.federation.compatibility.model;

import java.util.List;

public record ProductResearch(CaseStudy study, String outcome) {

    public static final ProductResearch FEDERATION_STUDY = new ProductResearch(new CaseStudy("1234", "Federation Study"), null);
    public static final ProductResearch STUDIO_STUDY = new ProductResearch(new CaseStudy("1235", "Studio Study"), null);
    public static final List<ProductResearch> RESEARCH_LIST = List.of(FEDERATION_STUDY, STUDIO_STUDY);
}
