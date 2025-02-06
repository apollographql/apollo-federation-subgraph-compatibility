package org.acme.microprofile.graphql;

import io.smallrye.graphql.api.Directive;
import java.lang.annotation.Retention;
import static io.smallrye.graphql.api.DirectiveLocation.OBJECT;
import static java.lang.annotation.RetentionPolicy.RUNTIME;
import org.eclipse.microprofile.graphql.Name;

@Directive(on = { OBJECT })
@Name("custom")
@Retention(RUNTIME)
public @interface CustomDirective {
}