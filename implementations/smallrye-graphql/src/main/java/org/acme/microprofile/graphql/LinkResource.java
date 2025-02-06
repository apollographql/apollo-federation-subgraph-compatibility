package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.federation.link.Import;
import io.smallrye.graphql.api.federation.link.Link;
import org.eclipse.microprofile.graphql.GraphQLApi;
import static io.smallrye.graphql.api.federation.link.Link.FEDERATION_SPEC_LATEST_URL;
import io.smallrye.graphql.api.federation.ComposeDirective;

@GraphQLApi
@Link(url = FEDERATION_SPEC_LATEST_URL, _import = {
        @Import(name = "@shareable"),
        @Import(name = "@external"),
        @Import(name = "@requires"),
        @Import(name = "@composeDirective"),
        @Import(name = "@extends"),
        @Import(name = "@authenticated"),
        @Import(name = "@inaccessible"),
        @Import(name = "@interfaceObject"),
        @Import(name = "@key"),
        @Import(name = "@override"),
        @Import(name = "@provides"),
        @Import(name = "@requiresScopes"),
        @Import(name = "@tag"),
        @Import(name = "@policy")
})
@ComposeDirective(name = "@custom")
public class LinkResource {
}