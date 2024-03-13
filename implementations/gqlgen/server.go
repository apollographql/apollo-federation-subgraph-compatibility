package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"subgraph/graph"
	"subgraph/graph/generated"

	"github.com/99designs/gqlgen/graphql"
	"github.com/99designs/gqlgen/graphql/handler/apollofederatedtracingv1"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "4001"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}
	c := generated.Config{Resolvers: graph.NewRootResolver()}
	c.Directives.Custom = func(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
		return next(ctx)
	}
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(c))
	srv.Use(&apollofederatedtracingv1.Tracer{})

	http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
