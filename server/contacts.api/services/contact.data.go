package services

import (
	"contacts.api/data"
	"contacts.api/models"
	"errors"
	"log"
)

func CreateNewContact(contact *models.Contact) error {
	res := data.DB.Create(contact)
	if res.Error != nil {
		log.Print(res.Error)
		return res.Error
	}

	if res.RowsAffected == 0 {
		return errors.New("Unable to save contact")
	}

	return nil
}
