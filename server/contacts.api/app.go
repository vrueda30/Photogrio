package main

import (
	"contacts.api/data"
	"contacts.api/models"
	"contacts.api/services"
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"io"
	"log"
	"os"
	"time"
)

const basePath = "/api"

func main() {
	var f *os.File
	log.Print("Starting contact api")
	mydir, err := os.Getwd()
	if err != nil {
		fmt.Print(err)
	}
	env := os.Getenv("CONTACTS_API_ENV")
	err = godotenv.Load(".env." + env)
	if err != nil {
		log.Print(err)
	}

	logPath := fmt.Sprintf("%s/%s/%s", mydir, "logs", "contact-api.log")
	_, err = os.Stat(logPath)
	if err != nil {
		log.Printf("No file: %s", err.Error())
		f, _ = os.Create(logPath)
	} else {
		log.Print("Found contact api log")
		f, _ = os.OpenFile(logPath, os.O_APPEND|os.O_RDWR, 0750)
	}
	err = os.MkdirAll("images/profiles/", 0750)
	if err != nil {
		log.Print(err)
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
	services.SetupRoutes(router, basePath)
	router.Static("/images", "./images")
	dsn := data.Dsn()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	SeedData()
	if err != nil {
		log.Fatal(err)
	}

	err = db.AutoMigrate(&models.Contact{}, &models.Address{})
	port := os.Getenv("PORT")
	if port == "" {
		port = "5002"
	}
	log.Fatal(router.Run(fmt.Sprintf(":%s", port)))
}
