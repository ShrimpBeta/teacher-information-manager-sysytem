package main

import (
	"embed"
	"encoding/json"
	"fmt"
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
	"time"

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
	redisDB *redis.Client,
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
		RedisDB:              redisDB,
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

type Config struct {
	ServerURL                string        `json:"server_url"`
	ServerPort               string        `json:"server_port"`
	MongodbUrl               string        `json:"mongodb_url"`
	DatabaseName             string        `json:"database_name"`
	RedisAddress             string        `json:"redis_address"`
	AllowOrigins             string        `json:"allow_origins"`
	GraphQL                  string        `json:"graphql"`
	Playground               string        `json:"playground"`
	Restful                  string        `json:"restful"`
	AdminAccount             string        `json:"admin_account"`
	AdminPassword            string        `json:"admin_password"`
	UserTokenExpireTime      time.Duration `json:"user_token_expire_time"`
	AdminTokenExpireDuration time.Duration `json:"admin_token_expire_duration"`
	CodeExpireTime           time.Duration `json:"code_expire_time"`
	GenerateLimitTime        time.Duration `json:"generate_limit_time"`
	EmailHost                string        `json:"email_host"`
	EmailPort                int           `json:"email_port"`
	EmailUsername            string        `json:"email_username"`
	EmailPassword            string        `json:"email_password"`
	AppID                    string        `json:"app_id"`
	AppSecret                string        `json:"app_secret"`
	TesseractPath            string        `json:"tesseract_path"`
}

func main() {

	//load config.json
	configFile := "config.json"
	if _, err := os.Stat(configFile); os.IsNotExist(err) {
		// if config.json not exist, create it
		defaultConfig := Config{
			ServerURL:                environment.ServerURL,
			ServerPort:               environment.ServerPort,
			MongodbUrl:               environment.MongodbUrl,
			DatabaseName:             environment.DatabaseName,
			RedisAddress:             environment.RedisAddress,
			AllowOrigins:             environment.AllowOrigins,
			GraphQL:                  environment.GraphQL,
			Playground:               environment.Playground,
			Restful:                  environment.Restful,
			AdminAccount:             environment.AdminAccount,
			AdminPassword:            environment.AdminPassword,
			UserTokenExpireTime:      environment.UserTokenExpireTime,
			AdminTokenExpireDuration: environment.AdminTokenExpireDuration,
			CodeExpireTime:           environment.CodeExpireTime,
			GenerateLimitTime:        environment.GenerateLimitTime,
			EmailHost:                environment.EmailHost,
			EmailPort:                environment.EmailPort,
			EmailUsername:            environment.EmailUsername,
			EmailPassword:            environment.EmailPassword,
			AppID:                    environment.AppID,
			AppSecret:                environment.AppSecret,
			TesseractPath:            environment.TesseractPath,
		}

		// Serialization Config
		data, err := json.MarshalIndent(defaultConfig, "", "    ")
		if err != nil {
			log.Fatalf("Failed to marshal default config: %v", err)
		}
		err = os.WriteFile(configFile, data, 0666)
		if err != nil {
			log.Fatal("Failed to write config file")
		}
		fmt.Println("No Config file, created Config file, please modify it and restart the server")
		os.Exit(0)
	} else {
		// if config.json exist, load it
		data, err := os.ReadFile(configFile)
		if err != nil {
			log.Fatal("Failed to read config file")
		}
		var config Config
		err = json.Unmarshal(data, &config)
		if err != nil {
			log.Fatal("Failed to unmarshal config file")
		}
		environment.ServerURL = config.ServerURL
		environment.ServerPort = config.ServerPort
		environment.MongodbUrl = config.MongodbUrl
		environment.DatabaseName = config.DatabaseName
		environment.RedisAddress = config.RedisAddress
		environment.AllowOrigins = config.AllowOrigins
		environment.GraphQL = config.GraphQL
		environment.Playground = config.Playground
		environment.Restful = config.Restful
		environment.AdminAccount = config.AdminAccount
		environment.AdminPassword = config.AdminPassword
		environment.UserTokenExpireTime = config.UserTokenExpireTime
		environment.AdminTokenExpireDuration = config.AdminTokenExpireDuration
		environment.CodeExpireTime = config.CodeExpireTime
		environment.GenerateLimitTime = config.GenerateLimitTime
		environment.EmailHost = config.EmailHost
		environment.EmailPort = config.EmailPort
		environment.EmailUsername = config.EmailUsername
		environment.EmailPassword = config.EmailPassword
		environment.AppID = config.AppID
		environment.AppSecret = config.AppSecret
		environment.TesseractPath = config.TesseractPath
	}

	// Database Connect
	DB := database.Connect(environment.MongodbUrl)
	defer DB.DisConnect()

	// init redis
	rdb := redis.NewClient(&redis.Options{
		Addr:     environment.RedisAddress,
		Password: "",
		DB:       0,
	})
	fmt.Println("Redis connected")
	defer rdb.Close()

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
	userService := services.NewUserService(repository.UserRepo)

	// set gin mode to release
	// gin.SetMode(gin.ReleaseMode)

	// Setting up Gin
	r := gin.Default()

	// if static folder not exist, create it
	err := os.MkdirAll(filepath.Dir("assets/avatars/avatar.png"), os.ModePerm)
	if err != nil {
		log.Fatal("Failed to create static folder")
	}
	// create temp folder for file upload
	err = os.MkdirAll(filepath.Dir("temp/unknown"), os.ModePerm)
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
	r.POST(environment.GraphQL, graphHandler(classScheduleService, compGuidanceService, eduReformService, mentorshipService, monographService, paperService, passwordService, sciResearchService, uGPGGuidanceService, userService, rdb))
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
		if err := r.Run(`:` + environment.ServerPort); err != nil {
			log.Fatalf("Failed to start server: %v", err)
		}
	}()

	// Safe shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGALRM)
	<-quit

	log.Println("Shutdown successful!")
}
