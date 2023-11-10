package models

import "gorm.io/gorm"

type Contact struct {
	gorm.Model
	FirstName   string      `json:"firstName"`
	LastName    string      `json:"lastName"`
	Email       string      `json:"email"`
	Phone       string      `json:"phone"`
	AccountId   string      `json:"accountId"`
	ContactType ContactType `json:"contactType"`
	Address     Address     `json:"address"`
}

type Address struct {
	gorm.Model
	Address1  string `json:"address1"`
	Address2  string `json:"address2"`
	City      string `json:"city"`
	State     string `json:"state"`
	Zip       string `json:"zip"`
	AccountId string `json:"accountId"`
}

type ContactDTO struct {
	FirstName   string `json:"firstName"`
	LastName    string `json:"lastName"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	ContactType int    `json:"contactType"`
	Address1    string `json:"address1"`
	Address2    string `json:"address2"`
	City        string `json:"city"`
	State       string `json:"state"`
	Zip         string `json:"zip"`
	AccountId   string `json:"accountId"`
}
