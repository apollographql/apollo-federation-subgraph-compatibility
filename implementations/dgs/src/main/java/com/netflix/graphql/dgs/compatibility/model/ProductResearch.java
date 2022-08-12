package com.netflix.graphql.dgs.compatibility.model;

import java.util.List;

public class ProductResearch {
    public static final ProductResearch FEDERATION_STUDY = new ProductResearch(new CaseStudy("1234", "Federation Study"));
    public static final ProductResearch STUDIO_STUDY = new ProductResearch(new CaseStudy("1235", "Studio Study"));
    public static final List<ProductResearch> RESEARCH_LIST = List.of(FEDERATION_STUDY, STUDIO_STUDY);

    private final CaseStudy study;
    private final String outcome;

    public ProductResearch(CaseStudy study) {
        this.study = study;
        this.outcome = null;
    }

    public ProductResearch(CaseStudy study, String outcome) {
        this.study = study;
        this.outcome = outcome;
    }

    public CaseStudy getStudy() {
        return study;
    }

    public String getOutcome() {
        return outcome;
    }
}
