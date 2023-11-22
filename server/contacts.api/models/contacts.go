package models

import (
	"database/sql"
	"gorm.io/gorm"
	"mime/multipart"
)

type Contact struct {
	gorm.Model
	FirstName   string         `json:"firstName"`
	LastName    string         `json:"lastName"`
	Email       string         `json:"email"`
	Phone       string         `json:"phone"`
	AccountId   int            `json:"accountId"`
	ContactType int            `json:"contactType"`
	AddressId   int            `json:"addressId"`
	Address     Address        `json:"address"`
	ProfilePic  string         `json:"profilePic"`
	BirthDay    sql.NullTime   `json:"birthDay"`
	Notes       sql.NullString `json:"notes"`
}

type UserProfileDTO struct {
	ContactId  int                   `json:"contactId"`
	FileName   string                `json:"profilePath"`
	ProfilePic *multipart.FileHeader `json:"profilePic"`
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
	AccountId   int    `json:"accountId"`
}

type ContactViewDTO struct {
	ID          int    `json:"ID"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Phone       string `json:"phone"`
	ContactType int    `json:"contactType"`
}
