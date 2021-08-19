package com.apollographql.federation.compatibility.graphqljava;

import graphql.kickstart.servlet.context.GraphQLServletContext;
import org.dataloader.DataLoaderRegistry;

import javax.security.auth.Subject;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public class Context implements GraphQLServletContext {
    private final String tracingHeader;
    private final GraphQLServletContext context;

    public Context(GraphQLServletContext context, String tracingHeader) {
        this.context = context;
        this.tracingHeader = tracingHeader;
    }

    @Override
    public List<Part> getFileParts() {
        return context.getFileParts();
    }

    @Override
    public Map<String, List<Part>> getParts() {
        return context.getParts();
    }

    @Override
    public HttpServletRequest getHttpServletRequest() {
        return context.getHttpServletRequest();
    }

    @Override
    public HttpServletResponse getHttpServletResponse() {
        return context.getHttpServletResponse();
    }

    @Override
    public Optional<Subject> getSubject() {
        return context.getSubject();
    }

    @Override
    public DataLoaderRegistry getDataLoaderRegistry() {
        return context.getDataLoaderRegistry();
    }

    public String getTracingHeader() {
        return tracingHeader;
    }
}
