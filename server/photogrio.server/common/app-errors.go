package common

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

func HandlePanicError(err error) {
	if err != nil {
		log.Print(err)
		panic(err.Error)
	}
}

func SendBadRequest(ctx *gin.Context, msg string) {
	ctx.JSON(http.StatusBadRequest, gin.H{"error": msg})
}
