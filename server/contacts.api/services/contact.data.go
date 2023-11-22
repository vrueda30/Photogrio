package services

import (
	"contacts.api/data"
	"contacts.api/middleware"
	"contacts.api/models"
	"database/sql"
	"errors"
	"log"
)

func GetContact(contactId int, accountId int) (*models.Contact, error) {
	var contact = &models.Contact{}
	res := data.DB.Where("id=? AND account_id=?", contactId, accountId).First(&contact)
	if res.Error != nil {
		log.Print(res.Error)
		return nil, res.Error
	}
	return contact, nil
}

func GetProfileUrlForContact(contactId int) (string, error) {
	var url sql.NullString
	res := data.DB.Raw("SELECT profile_pic FROM contacts WHERE id = ?", contactId).Scan(&url)
	if res.Error != nil {
		log.Print(res.Error)
		return "", res.Error
	}

	return url.String, nil
}

func UpdateProfileUrlForContact(url string, contactId int) error {
	res := data.DB.Model(&models.Contact{}).Where("id = ?", contactId).Update("profile_pic", url)
	if res.Error != nil {
		log.Print(res.Error)
		return res.Error
	}

	return nil
}

func CreateNewContact(contact *models.Contact) error {
	log.Printf("Account id from cookie: %d", middleware.Cookie.AccountId)
	res := data.DB.Select("FirstName", "LastName", "Phone", "AccountId", "ContactType", "Email").Create(contact)
	if res.Error != nil {
		log.Print(res.Error)
		return res.Error
	}

	if res.RowsAffected == 0 {
		return errors.New("Unable to save contact")
	}

	return nil
}

func GetContactsForAccount() ([]models.Contact, error) {
	var id = middleware.Cookie.AccountId
	var contacts = &[]models.Contact{}
	res := data.DB.Where("account_id=?", id).Find(&contacts)
	if res.Error != nil {
		log.Print(res.Error.Error())
		return nil, res.Error
	}
	return *contacts, nil
}
