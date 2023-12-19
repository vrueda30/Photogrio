package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"io"
	"job.api/data"
	"job.api/models"
	"job.api/services"
	"log"
	"os"
	"time"
)

const apiBasePath = "api"

func main() {
	log.Print("Starting job api")
	var f *os.File
	mydir, err := os.Getwd()
	if err != nil {
		fmt.Print(err)
	}
	env := os.Getenv("JOBS_API_ENV")
	err = godotenv.Load(".env." + env)
	if err != nil {
		log.Print(err)
	}

	logPath := fmt.Sprintf("%s/%s/%s", mydir, "logs", "jobs-api.log")
	_, err = os.Stat(logPath)
	if err != nil {
		log.Printf("No file: %s", err.Error())
		f, _ = os.Create(logPath)
	} else {
		log.Print("Found scheduling api log")
		f, _ = os.OpenFile(logPath, os.O_APPEND|os.O_RDWR, 0750)
	}
	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
	if err != nil {
		log.Print(err)
	}
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "PUT", "POST", "PATCH", "OPTIONS"},
		AllowHeaders:     []string{"origin", "content-type", "accept", "X-Custom-Header", "Authorization", "account"},
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

	dsn := data.Dsn()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err.Error())
	}

	err = db.AutoMigrate(&models.Job{}, &models.JobType{})
	if err != nil {
		log.Fatal(err)
	}
	services.SetupRoutes(router, apiBasePath)

	port := os.Getenv("PORT")
	if port == "" {
		port = "5004"
	}
	log.Fatal(router.Run(fmt.Sprintf(":%s", port)))
}
