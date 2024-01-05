package models

import (
	"database/sql"
	"database/sql/driver"
	"gorm.io/gorm"
	"time"
)

type NullTime struct {
	Time  time.Time
	Valid bool
}

func (nt *NullTime) Scan(value interface{}) error {
	nt.Time, nt.Valid = value.(time.Time)
	return nil
}

func (nt NullTime) Value() (driver.Value, error) {
	if !nt.Valid {
		return nil, nil
	}
	return nt.Time, nil
}

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
