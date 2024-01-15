package models

import (
	"gorm.io/gorm"
)

type Account struct {
	gorm.Model
	Owner       User   `json:"owner"`
	CompanyName string `json:"companyName"`
	IsActive    bool   `json:"isActive"`
	SetupStep   int    `json:"setupStep" gorm:"default:1"`
}

type Signup struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Company  string `json:"company"`
}
