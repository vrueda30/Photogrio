package services

import (
	"account.api/services/models"
	"log"
)

func init() {

}

func CreateAccount(account models.Account) (int, error) {
	result := db.Create(&account)
	if result.Error != nil {
		log.Print(result.Error)
		return -1, result.Error
	}

	return int(account.ID), nil
}
