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
	"server/database"
	"server/services"
	"server/services/models"
	"time"
)

const basePath = "/api"

func main() {
	log.Print("Starting photogrio server")
	MakeLogDirectory()
	f, e := os.Create("/logs/photogrio.log")
	if e != nil {
		log.Print(e)
		//log.Fatal(e)
	}
	log.Print(f.Name())

	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
	err := godotenv.Load()
	if err != nil {
		log.Print(err)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "PUT", "POST", "OPTIONS"},
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
	dsn := database.Dsn()
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatal(err)
	}

	err = db.AutoMigrate(&models.Account{}, &models.User{})

	if err != nil {
		log.Fatal(err)
	}

	log.Fatal(router.Run(":5001"))
}

func MakeLogDirectory() {

	_, err := os.Stat("/logs/")
	if os.IsNotExist(err) {
		err = os.Mkdir("/logs/", os.ModeDir)
		if err != nil {
			log.Print(err)
		}
	}
	if err != nil {
		log.Print(err)
	}
}
