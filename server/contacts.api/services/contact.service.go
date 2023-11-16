package services

import (
	"contacts.api/middleware"
	"contacts.api/models"
	"contacts.api/security"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"strconv"
	"time"
)

const contactPath = "contacts"

var (
	loc *time.Location
)

func init() {
	var err error
	loc, err = time.LoadLocation("UTC")
	if err != nil {
		log.Print(err)
	}
}

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	router.POST(fmt.Sprintf("%s/%s/%s/:accountId", apiBasePath, contactPath, "create_contact"), middleware.CheckJWT(), middleware.ReadCookie(), createContact)
	router.GET(fmt.Sprintf("%s/%s/%s/:accountId", apiBasePath, contactPath, "get_cookies"), middleware.CheckJWT(), getContactServiceCookie)
	router.GET(fmt.Sprintf("%s/%s/:accountId", apiBasePath, contactPath), middleware.CheckJWT(), middleware.ReadCookie(), getContacts)
}

func getContacts(ctx *gin.Context) {
	var param = ctx.Param("accountId")
	acctId, err := strconv.Atoi(param)
	if err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if acctId != middleware.Cookie.AccountId {
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Bad request"})
		return
	}

	res, err := GetContactsForAccount()
	if err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var data = convertToContactViewList(res)
	ctx.JSON(http.StatusOK, gin.H{"data": data})
	return
}

func convertToContactViewList(contacts []models.Contact) *[]models.ContactViewDTO {
	contactList := []models.ContactViewDTO{}
	for i := 0; i < len(contacts); i++ {
		contact := models.ContactViewDTO{ID: int(contacts[i].ID),
			Email:       contacts[i].Email,
			Phone:       contacts[i].Phone,
			Name:        fmt.Sprintf("%s %s", contacts[i].FirstName, contacts[i].LastName),
			ContactType: contacts[i].ContactType}
		contactList = append(contactList, contact)
	}
	return &contactList
}

func createContact(context *gin.Context) {
	var newContact *models.ContactDTO
	accountId := middleware.Cookie.AccountId
	log.Print(accountId)
	if err := context.ShouldBindJSON(&newContact); err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var contact models.Contact
	contact = models.Contact{FirstName: newContact.FirstName, LastName: newContact.LastName,
		Email: newContact.Email, Phone: newContact.Phone, AccountId: newContact.AccountId, ContactType: newContact.ContactType,
	}
	err := CreateNewContact(&contact)
	if err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusCreated, contact)
	return
}

func getContactServiceCookie(ctx *gin.Context) {
	accountId := ctx.Param("accountId")
	acctId, _ := strconv.Atoi(accountId)
	var acct = models.Account{AccountId: acctId}
	cookie := models.Cookie{AccountId: acct.AccountId}
	acctAsBytes, err := json.Marshal(&cookie)
	if err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
	}
	cipherText := security.Encrypt(acctAsBytes, os.Getenv("SESSION_KEY"))
	log.Print(cipherText)
	ctx.SetCookie("contactapi", string(cipherText), 60*60*24, "/", "localhost", false, true)
	ctx.JSON(http.StatusOK, "{status:ok}")
	return
}
