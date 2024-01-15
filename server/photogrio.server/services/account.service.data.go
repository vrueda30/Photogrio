package services

import (
	"log"
	"photogrio-server/database"
	"photogrio-server/models"
)

func init() {

}

func CreateAccount(account models.Account) (int, error) {
	result := database.DB //DB.Create(&account)
	if result.Error != nil {
		log.Print(result.Error)
		return -1, result.Error
	}

	return int(account.ID), nil
}

func GetSetupStatus(accountId int) (int, error) {
	log.Printf("account id: %d", accountId)
	var account = &models.Account{}
	results := database.DB.Select("setup_step").Where("id=?", accountId).Find(&account)
	if results.Error != nil {
		return -1, results.Error
	}
	log.Printf("results: %s", results)
	return account.SetupStep, nil
}

func IncrementSetupStep(accountId int) error {
	var account = &models.Account{}
	results := database.DB.Where("id=?", accountId).Find(&account)
	if results.Error != nil {
		return results.Error
	}
	account.SetupStep += 1
	database.DB.Save(&account)
	return nil
}
