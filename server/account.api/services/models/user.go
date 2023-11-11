package models

import (
	"gorm.io/gorm"
)

type User struct {
	gorm.Model
	Name      string   `json:"name"`
	FirstName string   `json:"firstName"`
	LastName  string   `json:"lastName"`
	Email     string   `json:"email"`
	Phone     string   `json:"phone"`
	AccountId int      `json:"accountId"`
	Account   *Account `json:"models"`
	Deleted   bool     `json:"deleted"`
	AuthId    string   `json:"authId"`
}

type UserSessionInfo struct {
	Name      string `json:"name"`
	AccountId int    `json:"accountId"`
	UserId    int    `json:"userId"`
}
