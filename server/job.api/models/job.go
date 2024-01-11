package models

import (
	"database/sql"
	"gorm.io/gorm"
	"time"
)

type JobType struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	AccountId   int    `json:"accountId"`
}

type Job struct {
	gorm.Model
	Name         string       `json:"name"`
	AccountId    int          `json:"accountId"`
	JobTypeId    int          `json:"jobId"`
	JobType      JobType      `json:"job"`
	Location     string       `json:"location"`
	JobDateStart sql.NullTime `json:"jobDateStart"`
	JobDateEnd   sql.NullTime `json:"jobDateEnd"`
	ClientId     int          `json:"clientId"`
	Notes        string       `json:"notes"`
	AllDay       bool         `json:"allDay"`
}

type JobCreateDTO struct {
	Id           int       `json:"id"`
	Name         string    `json:"name"`
	Location     string    `json:"location"`
	JobDateStart time.Time `json:"jobDateStart"`
	JobDateEnd   time.Time `json:"jobDateEnd"`
	AllDay       bool      `json:"allDay"`
	Notes        string    `json:"notes"`
	JobType      int       `json:"jobType"`
	Client       int       `json:"client"`
}

type JobCalendarView struct {
	Id     int       `json:"id"`
	Title  string    `json:"title"`
	AllDay bool      `json:"allDay"`
	Start  time.Time `json:"start"`
	End    time.Time `json:"end"`
}
