package services

import (
	"log"
	"server/services/models"
)

func CreateNewUser(newUser models.User) (int, error) {
	res, err := CreateUser(newUser)
	if err != nil {
		log.Print(err)
		return -1, err
	}

	return res, nil
}
