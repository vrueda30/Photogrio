package services

import (
	"contacts.api/middleware"
	"contacts.api/models"
	"contacts.api/security"
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"log"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"
)

const contactPath = "contacts"
const imageFolder = "images"

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

// router.Group(fmt.Sprintf("%s/%s/", apiBasePath, accountPath))
func SetupRoutes(router *gin.Engine, apiBasePath string) {
	router.POST(fmt.Sprintf("%s/%s/%s/:accountId", apiBasePath, contactPath, "create_contact"), middleware.CheckJWT(), middleware.ReadCookie(), createContact)
	router.GET(fmt.Sprintf("%s/%s/%s/:accountId", apiBasePath, contactPath, "get_cookies"), middleware.CheckJWT(), getContactServiceCookie)
	router.GET(fmt.Sprintf("%s/%s/:accountId", apiBasePath, contactPath), middleware.CheckJWT(), middleware.ReadCookie(), getContacts)
	router.GET(fmt.Sprintf("%s/%s/getContactsForAccount", apiBasePath, contactPath), middleware.CheckJWT(), middleware.ReadCookie(), getContactsForAccount)
	router.GET(fmt.Sprintf("%s/%s/%s/:contactId", apiBasePath, contactPath, "get_contact"), middleware.CheckJWT(), middleware.ReadCookie(), getContact)
	router.POST(fmt.Sprintf("%s/%s/%s/:contactId", apiBasePath, contactPath, "save_profile_avatar"), middleware.CheckJWT(), middleware.ReadCookie(), uploadProfilePicForContact)
	router.PUT(fmt.Sprintf("%s/%s/", apiBasePath, contactPath), middleware.CheckJWT(), middleware.ReadCookie(), updateContact)
}

func getContactsForAccount(ctx *gin.Context) {
	log.Print("In get contacts")
	res, err := GetContactListForAccount()
	log.Print("Out of get contacts")

	if err != nil {
		log.Print(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var data = res
	log.Printf("Converted data %s", data)
	ctx.JSON(http.StatusOK, gin.H{"data": data})
	return
}

func getContact(ctx *gin.Context) {
	contactId, err := strconv.Atoi(ctx.Param("contactId"))
	if err != nil {
		log.Print(err.Error())
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	contact, cerr := GetContact(contactId, middleware.Cookie.AccountId)
	if cerr != nil {
		log.Print(cerr)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": cerr.Error()})
		return
	}

	ctx.JSON(http.StatusOK, contact)

	return
}

func uploadProfilePicForContact(ctx *gin.Context) {
	contactId, _ := strconv.Atoi(ctx.Param("contactId"))
	_file, err := ctx.FormFile("image")
	if err != nil {
		handleError(err, ctx)
		return
	}
	_, err = deleteProfilePicByContactId(contactId)
	if err != nil {
		handleError(err, ctx)
		return
	}
	path := getPathForContact(contactId, _file.Filename)
	err = ctx.SaveUploadedFile(_file, path)
	if err != nil {
		handleError(err, ctx)
		return
	}

	url := getUrlForImage(path)
	err = UpdateProfileUrlForContact(url, contactId)
	if err != nil {
		handleError(err, ctx)
		return
	}
	log.Print(url)
	ctx.JSON(http.StatusOK, gin.H{"url": url})

	return
}

func deleteProfilePicByContactId(contactId int) (bool, error) {
	url, err := GetProfileUrlForContact(contactId)
	if err != nil {
		return false, err
	}
	if url == "" {
		return true, nil
	}
	segmentedUrl := strings.Split(url, "/")
	imageName := segmentedUrl[len(segmentedUrl)-1]
	path := fmt.Sprintf("./images/%s", imageName)
	err = os.Remove(path)
	if err != nil {
		log.Print(err)
		return false, err
	}
	return true, nil
}

func getUrlForImage(path string) string {
	pathLength := len(path)
	imgPath := path[1:pathLength]
	url := fmt.Sprintf("%s%s", os.Getenv("URL_BASE"), imgPath)

	return url
}

func handleError(err error, ctx *gin.Context) {
	log.Print(err.Error())
	ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
}

func getPathForContact(contactId int, fileName string) string {
	fullFileName := fmt.Sprintf("%s-%s", uuid.New().String(), fileName)
	path := fmt.Sprintf("%s/%s", "./images", fullFileName)
	return path
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
	log.Printf("Converted data %s", data)
	ctx.JSON(http.StatusOK, gin.H{"data": data})
	return
}

func convertToContactViewList(contacts []models.Contact) *[]models.ContactViewDTO {
	sort.SliceStable(contacts, func(i, j int) bool {
		return contacts[i].LastName < contacts[j].LastName
	})
	log.Print(contacts)
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

func updateContact(ctx *gin.Context) {
	var updatedContact *models.Contact
	accountId := middleware.Cookie.AccountId
	if err := ctx.ShouldBindJSON(&updatedContact); err != nil {
		log.Print(err)
		log.Print(accountId)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if updatedContact.AddressId == 0 {
		var address = models.Address{Address1: updatedContact.Address.Address1, Address2: updatedContact.Address.Address2, City: updatedContact.Address.City,
			State: updatedContact.Address.State, Zip: updatedContact.Address.Zip, AccountId: middleware.Cookie.AccountId}
		if err := CreateAddress(&address); err != nil {
			handleError(err, ctx)
			return
		}
		updatedContact.AddressId = int(address.ID)
		updatedContact.Address = address
	}

	log.Printf("Address id post db create: %d", updatedContact.AddressId)
	if err := UpdateContact(updatedContact, accountId); err != nil {
		handleError(err, ctx)
		return
	}

	ctx.JSON(http.StatusOK, &updatedContact)
	return
}

func createContact(context *gin.Context) {
	var newContact *models.ContactDTO
	accountId := middleware.Cookie.AccountId
	if err := context.ShouldBindJSON(&newContact); err != nil {
		log.Print(err)
		log.Print(accountId)
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
	ctx.JSON(http.StatusOK, "{status:Ok}")
	return
}
