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

func GetSetupStatus(accountId int) (int, error) {
	log.Printf("account id: %d", accountId)
	var account = &models.Account{}
	results := db.Select("setup_step").Where("id=?", accountId).Find(&account)
	if results.Error != nil {
		return -1, results.Error
	}
	log.Printf("results: %s", results)
	return account.SetupStep, nil
}

func IncrementSetupStep(accountId int) error {
	var account = &models.Account{}
	results := db.Where("id=?", accountId).Find(&account)
	if results.Error != nil {
		return results.Error
	}
	account.SetupStep += 1
	db.Save(&account)
	return nil
}
