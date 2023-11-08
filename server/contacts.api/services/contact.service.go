package services

import (
	"contacts.api/middleware"
	"contacts.api/models"
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
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
	router.POST(fmt.Sprintf("%s/%s/%s", apiBasePath, contactPath, "create_contact"), middleware.CheckJWT(), createContact)
}

func createContact(context *gin.Context) {
	var newContact *models.ContactDTO
	if err := context.ShouldBindJSON(newContact); err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var contact models.Contact
	contact = models.Contact{FirstName: newContact.FirstName, LastName: newContact.LastName,
		Email: newContact.Email, Phone: newContact.Phone, AccountId: newContact.AccountId, Address: models.Address{
			Address1: newContact.Address1, Address2: newContact.Address2, City: newContact.City,
			State: newContact.State, Zip: newContact.Zip,
		}}
	err := CreateNewContact(&contact)
	if err != nil {
		log.Print(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusCreated, contact)
	return
}
