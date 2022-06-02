package graphql.kickstart.federation.compatibility;

import com.apollographql.federation.graphqljava.tracing.FederatedTracingInstrumentation;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class AppConfiguration {

    @Bean
    public graphql.execution.instrumentation.Instrumentation federatedTracingInstrumentation() {
        return new FederatedTracingInstrumentation();
    }
}
