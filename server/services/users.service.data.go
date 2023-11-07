package services

import (
	"errors"
	"log"
	"server/services/models"
)

func init() {

}

func CreateUser(user models.User) (int, error) {
	res := db.Create(&user)
	if res.Error != nil {
		log.Print(res.Error)
		return -1, res.Error
	}

	if res.RowsAffected == 0 {
		return -1, errors.New("Unable to create user")
	}

	return int(user.ID), nil
}
