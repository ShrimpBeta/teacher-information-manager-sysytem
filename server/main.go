package main

import (
	"embed"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"server/environment"
	"server/graph"
	"server/graph/resolvers"
	"server/middlewares"
	"server/persistence/database"
	"server/persistence/repository"
	"server/restful"
	"server/services/services"
	"strings"
	"syscall"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/redis/go-redis/v9"
)

//go:embed admin-dashboard/build
var clientBuildFS embed.FS

func graphHandler(
	// accountService *services.AccountService,
	classScheduleService *services.ClassScheduleService,
	compGuidanceService *services.CompGuidanceService,
	eduReformService *services.EduReformService,
	mentorshipService *services.MentorshipService,
	monographService *services.MonographService,
	paperService *services.PaperService,
	passwordService *services.PasswordService,
	sciResearchService *services.SciResearchService,
	uGPGGuidanceService *services.UGPGGuidanceService,
	userService *services.UserService,
) gin.HandlerFunc {
	h := handler.NewDefaultServer(graph.NewExecutableSchema(graph.Config{Resolvers: &resolvers.Resolver{
		// AccountService:       accountService,
		ClassScheduleService: classScheduleService,
		CompGuidanceService:  compGuidanceService,
		EduReformService:     eduReformService,
		MentorshipService:    mentorshipService,
		MonographService:     monographService,
		PaperService:         paperService,
		PasswordService:      passwordService,
		SciResearchService:   sciResearchService,
		UGPGGuidanceService:  uGPGGuidanceService,
		UserService:          userService,
	}}))
	return func(ctx *gin.Context) {
		h.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func playgroundHandler() gin.HandlerFunc {
	h := playground.Handler("GraphQL", environment.GraphQL)

	return func(ctx *gin.Context) {
		h.ServeHTTP(ctx.Writer, ctx.Request)
	}
}

func main() {

	// Database Connect
	DB := database.Connect(environment.DefaultMongodbUrl)
	defer DB.DisConnect()

	// init redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     environment.RedisAddress,
		Password: "",
		DB:       0,
	})

	// init Repos
	repository := repository.NewRepositorys(DB.Client.Database(environment.DatabaseName))

	// init Services
	accountService := services.NewAccountService(repository.UserRepo)
	classScheduleService := services.NewClassScheduleService(repository.ClassScheduleRepo)
	compGuidanceService := services.NewCompGuidanceService(repository.CompGuidanceRepo)
	eduReformService := services.NewEduReformService(repository.EduReformRepo)
	mentorshipService := services.NewMentorshipService(repository.MentorshipRepo)
	monographService := services.NewMonographService(repository.MonographRepo)
	paperService := services.NewPaperService(repository.PaperRepo)
	passwordService := services.NewPasswordService(repository.PasswordRepo)
	sciResearchService := services.NewSciResearchService(repository.SciResearchRepo)
	uGPGGuidanceService := services.NewUGPGGuidanceService(repository.UGPGGuidanceRepo)
	userService := services.NewUserService(repository.UserRepo, rdb)

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
		AllowMethods:     []string{"GET", "POST", "DELETE", "OPTIONS"},
		AllowCredentials: true,
	}))

	// add Auth Middleware
	r.Use(middlewares.AuthMiddleware())
	// add ginContext Middleware
	r.Use(middlewares.GinContextToContextMiddleware())

	// add RESTFUL API
	restful := restful.Restful{AccountService: accountService}

	// GraphQL API
	r.POST(environment.GraphQL, graphHandler(classScheduleService, compGuidanceService, eduReformService, mentorshipService, monographService, paperService, passwordService, sciResearchService, uGPGGuidanceService, userService))
	r.GET(environment.Playground, playgroundHandler())

	// RESTFUL API
	r.GET(environment.Restful+"/accounts", restful.GetAccounts)
	r.POST(environment.Restful+"/account/create", restful.CreateAccount)
	r.POST(environment.Restful+"/admin/signin", restful.AdminSignIn)
	r.DELETE(environment.Restful+"/account/delete/:id", restful.DeleteAccount)

	// Client Build
	fs, err := fs.Sub(clientBuildFS, "admin-dashboard/build")
	if err != nil {
		log.Fatalf("Failed to get sub filesystem: %v", err)
	}

	r.StaticFS("/client", http.FS(fs))

	r.NoRoute(func(c *gin.Context) {
		if strings.HasPrefix(c.Request.URL.Path, "/client") {
			c.FileFromFS("index.html", http.FS(fs))
		} else {
			c.JSON(404, gin.H{"error": "Not Found"})
		}
	})

	go func() {
		if err := r.Run(`:` + environment.DefaultPort); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Safe shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGALRM)
	<-quit

	log.Println("Shutdown successful!")
}
