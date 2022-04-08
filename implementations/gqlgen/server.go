package main

import (
	"log"
	"net/http"
	"os"
	"subgraph/graph"
	"subgraph/graph/generated"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
)

const defaultPort = "4001"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: graph.NewRootResolver()}))

	http.Handle("/playground", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
