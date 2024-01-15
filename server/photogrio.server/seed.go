package main

import (
	"log"
	"photogrio-server/database"
	"photogrio-server/models"
)

func SeedData() error {
	if !database.DB.Migrator().HasTable(&models.ContactType{}) {
		err := database.DB.Migrator().CreateTable(&models.ContactType{})
		if handleError(err) {
			return err
		}
		c := models.ContactType{Name: "Client"}
		r := database.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
		c = models.ContactType{Name: "Hot Lead"}
		r = database.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
		c = models.ContactType{Name: "Cold Lead"}
		r = database.DB.Create(&c)
		if handleError(r.Error) {
			return r.Error
		}
		c = models.ContactType{Name: "Other"}
		r = database.DB.Create(&c)
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
