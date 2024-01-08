package services

import (
	"errors"
	"log"
	"photogrio-server/services/models"
)

func init() {

}

func CreateUser(user models.User) (int, error) {
	res := DB.Create(&user)
	if res.Error != nil {
		log.Print(res.Error)
		return -1, res.Error
	}

	if res.RowsAffected == 0 {
		return -1, errors.New("Unable to create user")
	}

	return int(user.ID), nil
}

func GetUserSessionInfoByEmail(email string) (*models.UserSessionInfo, error) {
	var user = &models.User{}
	result := DB.Where("email = ?", email).First(&user)
	if result.Error != nil {
		log.Print(result.Error)
		return nil, result.Error
	}
	var userInfo = models.UserSessionInfo{
		UserId:    int(user.ID),
		Name:      user.FirstName + " " + user.LastName,
		AccountId: user.AccountId,
	}
	return &userInfo, nil
}
