package services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"photogrio-server/auth0client"
	"photogrio-server/middleware"
	"photogrio-server/services/models"
)

const accountPath = "accounts"

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	accounts := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, accountPath))
	accounts.POST(fmt.Sprintf("%s", "create_account"), createAccount)
	accounts.GET(fmt.Sprintf("%s", "setup_status"), middleware.CheckJWT(), middleware.ReadCookie(), getSetupStatus)
	accounts.GET(fmt.Sprintf("%s", "update_setup_status"), middleware.CheckJWT(), middleware.ReadCookie(), updateStatus)
}

func updateStatus(context *gin.Context) {
	id := middleware.Account.AccountId
	err := IncrementSetupStep(id)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"status": "ok"})
	return
}

func getSetupStatus(context *gin.Context) {
	res, err := GetSetupStatus(int(middleware.Account.AccountId))
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"setupStep": res})
	return
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
func Login() error {

	return nil
}

func CreateLists(accountId int) error {
	//http.Post()
	return nil
}
