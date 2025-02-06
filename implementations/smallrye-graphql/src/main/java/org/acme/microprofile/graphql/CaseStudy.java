package org.acme.microprofile.graphql;

import org.eclipse.microprofile.graphql.NonNull;
import org.eclipse.microprofile.graphql.Id;

public class CaseStudy {
    @Id
    @NonNull
    private final String caseNumber;
    private final String description;

    public CaseStudy(String caseNumber, String description) {
        this.caseNumber = caseNumber;
        this.description = description;
    }

    public String getCaseNumber() {
        return caseNumber;
    }

    public String getDescription() {
        return description;
    }
}