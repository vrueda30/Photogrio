package models

import (
	"gorm.io/gorm"
)

type ContactType struct {
	gorm.Model
	Name string `json:"name"`
}
