package main

import (
	"log"
	"net/http"
	"os"
	"subgraph/graph"
	"subgraph/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler/apollofederatedtracingv1"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

//go:generate go run -mod=mod github.com/99designs/gqlgen generate .

const defaultPort = "4001"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: graph.NewRootResolver()}))
	srv.Use(&apollofederatedtracingv1.Tracer{})

	http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
