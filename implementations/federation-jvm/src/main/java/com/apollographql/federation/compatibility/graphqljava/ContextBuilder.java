package com.apollographql.federation.compatibility.graphqljava;

import graphql.kickstart.execution.context.GraphQLContext;
import graphql.kickstart.servlet.context.DefaultGraphQLServletContext;
import graphql.kickstart.servlet.context.GraphQLServletContextBuilder;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.Session;
import javax.websocket.server.HandshakeRequest;

import static com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation.FEDERATED_TRACING_HEADER_NAME;

@Component
public class ContextBuilder implements GraphQLServletContextBuilder {
    @Override
    public GraphQLContext build(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        var context = DefaultGraphQLServletContext.createServletContext()
                .with(httpServletRequest)
                .with(httpServletResponse)
                .build();

        var tracingHeader = httpServletRequest.getHeader(FEDERATED_TRACING_HEADER_NAME);

        return new Context(context, tracingHeader);
    }

    @Override
    public GraphQLContext build(Session session, HandshakeRequest handshakeRequest) {
        throw new UnsupportedOperationException();
    }

    @Override
    public GraphQLContext build() {
        throw new UnsupportedOperationException();
    }
}
