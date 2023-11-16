package services

import (
	"contacts.api/data"
	"contacts.api/middleware"
	"contacts.api/models"
	"errors"
	"log"
)

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
