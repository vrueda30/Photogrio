package models

import (
	"database/sql"
	"gorm.io/gorm"
)

type Event struct {
	gorm.Model
	Name string `json:"name"`
}

type Meeting struct {
	Event
	ClientId      int32        `json:"clientId"`
	StartDateTime sql.NullTime `json:"startDateTime"`
	EndDateTime   sql.NullTime `json:"endDateTime"`
	Location      string       `json:"location"`
	Description   string       `json:"description"`
	Notes         string       `json:"notes"`
}

type Session struct {
	Event
	ClientId      int32        `json:"clientId"`
	StartDateTime sql.NullTime `json:"startDateTime"`
	EndDateTime   sql.NullTime `json:"endDateTime"`
	Location      string       `json:"location"`
	SessionType   int32        `json:"sessionType"`
	Notes         string       `json:"notes"`
}

type ToDo struct {
	Event
	DueDate   sql.NullString `json:"dueDate"`
	Completed bool           `json:"completed"`
}

func (t *ToDo) BeforeCreate(tx *gorm.DB) error {
	t.Completed = false
	return nil
}
