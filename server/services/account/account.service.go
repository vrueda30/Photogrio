package account

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

const accountPath = "accounts"

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	accounts := router.Group(fmt.Sprintf("%s/%s", apiBasePath, accountPath))
	accounts.POST(fmt.Sprintf("/%s", "create_account"), createAccount)
}

func createAccount(context *gin.Context) {
	var account Account
	if err := context.ShouldBindJSON(&account); err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
}
