package services

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"photogrio-server/middleware"
	"photogrio-server/security"
	"photogrio-server/services/models"
)

const userPath = "users"

func SetupUserRoutes(router *gin.Engine, apiBasePath string) {
	user := router.Group(fmt.Sprintf("%s/%s", apiBasePath, userPath))
	user.GET(fmt.Sprintf("%s/:email", "get_user_session_info"), middleware.CheckJWT(), getUserSessionInfo)
}

func CreateNewUser(newUser models.User) (int, error) {
	res, err := CreateUser(newUser)
	if err != nil {
		log.Print(err.Error())
		return -1, err
	}

	return res, nil
}

func getUserSessionInfo(context *gin.Context) {
	log.Print("In getr user session info")
	email := context.Param("email")
	log.Printf("Email coming in = %s", email)
	res, err := GetUserSessionInfoByEmail(email)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	acctAsBytes, err := json.Marshal(res)
	if err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	cipherText := security.Encrypt(acctAsBytes, os.Getenv("SESSION_KEY"))
	log.Print(cipherText)

	context.SetCookie("account", string(cipherText), 60*60*24, "/", "localhost", false, true)

	context.JSON(http.StatusOK, res)
	return
}
