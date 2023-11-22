package services

import (
	"account.api/auth0client"
	"account.api/services/models"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

const accountPath = "accounts"

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	accounts := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, accountPath))
	accounts.POST(fmt.Sprintf("%s", "create_account"), createAccount)
}

func createAccount(context *gin.Context) {
	var account models.Signup
	if err := context.ShouldBindJSON(&account); err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	var acc = auth0client.SignupUserDTO{
		Email:    account.Email,
		Password: account.Password,
		Name:     account.Name,
	}
	id, err := auth0client.SignUp(acc)
	if err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	log.Print(id)
	var newAccount = models.Account{CompanyName: account.Company}
	res, err := CreateAccount(newAccount)
	newAccount.ID = uint(res)
	if err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}

	user := models.User{Account: &newAccount, Name: account.Name, AuthId: *id, Email: account.Email}
	res, err = CreateNewUser(user)
	if res < 0 || err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	context.JSON(http.StatusCreated, gin.H{"id": res})
	return
}
