package services

import (
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"server/database"
)

var db *gorm.DB

func init() {
	dsn := database.Dsn()
	gdb, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println(err)
	}
	db = gdb
}
