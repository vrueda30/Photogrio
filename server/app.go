package main

import (
	"fmt"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"io"
	"log"
	"os"
	"server/database"
	"time"
)

const basePath = "/api"

func main() {
	f, e := os.Create("/photogrio/logs/photogrio.log")
	if e != nil {
		log.Fatal(e)
	}

	gin.DefaultWriter = io.MultiWriter(f, os.Stdout)
	err := godotenv.Load()
	if err != nil {
		log.Print(err)
	}

	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "PUT", "POST", "OPTIONS"},
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

	database.SetupDatabase()

	log.Fatal(router.Run(":5001"))
}
