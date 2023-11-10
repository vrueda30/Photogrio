package main

import (
	"contacts.api/data"
	"contacts.api/models"
	"log"
)

func SeedData() error {
	if !data.DB.Migrator().HasTable(&models.ContactType{}) {
		err := data.DB.Migrator().CreateTable(&models.ContactType{})
		if handleError(err) {
			return err
		}
		c := models.ContactType{Name: "Client"}
		r := data.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
		c = models.ContactType{Name: "Hot Lead"}
		r = data.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
		c = models.ContactType{Name: "Cold Lead"}
		r = data.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
		c = models.ContactType{Name: "Other"}
		r = data.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
	}
	return nil
}

func handleError(err error) bool {
	if err != nil {
		log.Print(err)
		return true
	}

	return false
}
