package services

import (
	"database/sql"
	"errors"
	"log"
	"photogrio-server/database"
	"photogrio-server/middleware"
	"photogrio-server/models"
)

func GetContact(contactId int, accountId int) (*models.Contact, error) {
	var contact = &models.Contact{}
	res := database.DB.Where("id=? AND account_id=?", contactId, accountId).Preload("Address").First(&contact)
	if res.Error != nil {
		log.Print(res.Error)
		return nil, res.Error
	}
	return contact, nil
}

func GetProfileUrlForContact(contactId int) (string, error) {
	var url sql.NullString
	res := database.DB.Raw("SELECT profile_pic FROM contacts WHERE id = ?", contactId).Scan(&url)
	if res.Error != nil {
		log.Print(res.Error)
		return "", res.Error
	}

	return url.String, nil
}

func UpdateProfileUrlForContact(url string, contactId int) error {
	res := database.DB.Model(&models.Contact{}).Where("id = ?", contactId).Update("profile_pic", url)
	if res.Error != nil {
		log.Print(res.Error)
		return res.Error
	}

	return nil
}

func CreateNewContact(contact *models.Contact) error {
	log.Printf("Account id from cookie: %d", middleware.AccountCookie.AccountId)
	res := database.DB.Select("FirstName", "LastName", "Phone", "AccountId", "ContactType", "Email").Create(contact)
	if res.Error != nil {
		log.Print(res.Error)
		return res.Error
	}

	if res.RowsAffected == 0 {
		return errors.New("Unable to save contact")
	}

	return nil
}

func GetContactListForAccount() ([]models.ContactListDTO, error) {
	accountId := middleware.AccountCookie.AccountId
	var contacts = &[]models.ContactListDTO{}
	res := database.DB.Table("contacts").
		Select("id", "first_name", "last_name", "CONCAT(first_name, ' ', last_name) as name").
		Where("account_id=?", accountId).
		Scan(&contacts)
	if res.Error != nil {
		return nil, res.Error
	}

	return *contacts, nil
}

func GetContactsForAccount() ([]models.Contact, error) {
	var id = middleware.AccountCookie.AccountId
	var contacts = &[]models.Contact{}
	res := database.DB.Where("account_id=?", id).Find(&contacts)
	if res.Error != nil {
		log.Print(res.Error.Error())
		return nil, res.Error
	}
	return *contacts, nil
}

func UpdateContact(updatedContact *models.Contact, accountId int) error {
	var contact *models.Contact
	res := database.DB.Where("id = ? AND account_id = ?", updatedContact.ID, accountId).First(&contact)
	if res.Error != nil || res.RowsAffected < 1 {
		log.Print(res.Error)
		return errors.New("Unable to update contact")
	}

	contact.FirstName = updatedContact.FirstName
	contact.LastName = updatedContact.LastName
	contact.Email = updatedContact.Email
	contact.Phone = updatedContact.Phone
	contact.ContactType = updatedContact.ContactType
	contact.BirthDay = updatedContact.BirthDay
	contact.Notes = updatedContact.Notes
	contact.AddressId = updatedContact.AddressId
	contact.Address = updatedContact.Address
	contact.Address.AccountId = middleware.AccountCookie.AccountId
	res = database.DB.Save(&contact)

	return nil
}

func CreateAddress(address *models.Address) error {
	if res := database.DB.Create(&address); res.Error != nil {
		log.Print(res.Error)
		return res.Error
	}
	log.Printf("Address id from create: %d", address.ID)
	return nil
}
