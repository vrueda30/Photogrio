package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	mysql "gorm.io/driver/mysql"
	"gorm.io/gorm"
	"io"
	"log"
	"os"
	"photogrio-server/database"
	"photogrio-server/models"
	"photogrio-server/services"
	"time"
)

const basePath = "/api"

func main() {
	log.Print("Starting photogrio server")
	MakeLogDirectory()
	f, e := os.Create("/photogrio/logs/photogrio.log")
	if e != nil {
		log.Print(e)
		log.Fatal(e)
	}
	log.Print(f.Name())

	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
	env := os.Getenv("ENVIRONMENT")
	err := godotenv.Load(".env." + env)
	if err != nil {
		log.Print(err)
	} else {
		log.Print("Environment loaded")
	}

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000", "https://localhost:3000"},
		AllowMethods:     []string{"GET", "PUT", "POST", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"origin", "content-type", "accept", "X-Custom-Header", "Authorization", "models"},
		AllowCredentials: true,
	}))
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("%s - [%s] \"%s %s %s %d %s \"%s\" %s\"\n",
			param.ClientIP,
			param.TimeStamp.Format(time.RFC1123),
			param.Method,
			param.Path,
			param.Request.Proto,
			param.StatusCode,
			param.Latency,
			param.Request.UserAgent(),
			param.ErrorMessage,
		)
	}))
	services.SetupRoutes(router, basePath)
	services.SetupUserRoutes(router, basePath)
	services.SetupWeatherRoutes(router, basePath)
	services.SetupContactRoutes(router, basePath)
	services.SetupJobsRoutes(router, basePath)
	services.SetupTODORoutes(router, basePath)

	dsn := database.Dsn()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	// start
	router.Static("/images", "./images")
	err = SeedData()
	if err != nil {
		log.Fatal(err)
	}
	//finish

	err = db.AutoMigrate(&models.Account{},
		&models.User{},
		&models.Contact{},
		&models.Address{},
		&models.Job{},
		&models.JobType{},
		&models.ToDo{},
		&models.ToDoList{})

	if err != nil {
		log.Fatal(err)
	}
	log.Fatal(router.RunTLS(fmt.Sprintf(":%s", "5001"), "localhost.pem", "localhostkey.pem"))
}

func MakeLogDirectory() {

	_, err := os.Stat("/photogrio/logs/")
	if os.IsNotExist(err) {
		err = os.Mkdir("/photogrio/logs/", os.ModeDir)
		if err != nil {
			log.Print(err)
		}
	}
	if err != nil {
		log.Print(err)
	}
}
