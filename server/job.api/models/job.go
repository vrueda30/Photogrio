package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type JobType struct {
	gorm.Model
	Name      string `json:"name"`
	AccountId int    `json:"accountId"`
}

type Job struct {
	gorm.Model
	Name      string       `json:"name"`
	AccountId int          `json:"accountId"`
	Job       JobType      `json:"job"`
	Location  string       `json:"location"`
	JobDate   sql.NullTime `json:"jobDate"`
	ClientId  int          `json:"clientId"`
}
