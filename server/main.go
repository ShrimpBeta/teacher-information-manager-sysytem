package main

import (
	"log"
	"os"
	"os/signal"
	"path/filepath"
	"server/graph"
	"server/graph/resolvers"
	"server/persistence/database"
	"server/persistence/repository"
	"syscall"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

const defaultPort = "8080"
const defaultMongodbUrl = "mongodb://localhost:27017"
const ServeURL = "http://localhost:8080"
const DatabaseName = "TeacherInfoMS"

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
	DB := database.Connect(defaultMongodbUrl)
	defer DB.DisConnect()

	// init Repos
	repository.Repos = repository.NewRepositorys(DB.Client.Database(DatabaseName))

	// set gin mode to release
	// gin.SetMode(gin.ReleaseMode)

	// Setting up Gin
	r := gin.Default()

	// if static folder not exist, create it
	err := os.MkdirAll(filepath.Dir("assets/avatars/avatar.png"), os.ModePerm)
	if err != nil {
		log.Fatal("Failed to create static folder")
	}

	// add Static FileServer
	r.Static("/avatars", "./assets/avatars")

	// add CORS Middleware
	r.Use(cors.New(cors.Config{
		// AllowOrigins:     []string{"http://localhost:3000", "http://localhost:4200", "http://localhost:8080"},
		AllowOrigins: []string{"*"},
		// AllowAllOrigins:  true,
		AllowHeaders:     []string{"Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// add Auth Middleware
	// r.Use(middlewares.AuthMiddleware())
	// add ginContext Middleware
	// r.Use(middlewares.GinContextToContextMiddleware())

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
