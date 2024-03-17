package main

import (
	"log"
	"os"
	"os/signal"
	"server/graph"
	"server/graph/resolvers"
	"server/middlewares"
	"server/persistence/database"
	"syscall"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const defaultPort = "8080"
const defaultMongodbUrl = "mongodb://localhost:27017"
const ServeURL = "http://localhost:8080"

func graphHandler() gin.HandlerFunc {
	h := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &resolvers.Resolver{}}))
	return func(ctx *gin.Context) {
		h.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", "/query")

	return func(ctx *gin.Context) {
		h.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func main() {

	// Database Connect
	database.DB = database.Connect(defaultMongodbUrl)
	defer database.DB.DisConnect()

	// Setting up Gin
	r := gin.Default()

	// add Static FileServer
	r.Static("/static", "./assets")

	// add CORS Middleware
	r.Use(cors.New(cors.Config{
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// add Auth Middleware
	r.Use(middlewares.AuthMiddleware())
	// add ginContext Middleware
	r.Use(middlewares.GinContextToContextMiddleware())

	r.POST("/query", graphHandler())
	r.GET("/", playgroundHandler())

	go func() {
		if err := r.Run(`:` + defaultPort); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Safe shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGALRM)
	<-quit

	log.Println("Shutdown successful!")
}
