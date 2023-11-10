package data

import (
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
	"log"
	"os"
)

const (
	username = "photogrioapi"
	password = "irishvrlr30"
	hostname = "photogriodb"
	dbname   = "photogriodb"
)

var DB *gorm.DB

func init() {
	db, err := gorm.Open(mysql.Open(Dsn()), &gorm.Config{})
	if err != nil {
		log.Print(err)
	}
	DB = db
}

func Dsn() string {
	var user string
	var pass string
	var host string
	var db string

	if os.Getenv("MYSQL_USER") == "" {
		user = username
		log.Print("user from default file")
	} else {
		user = os.Getenv("MYSQL_USER")
	}

	if os.Getenv("MYSQL_PASSWORD") == "" {
		pass = password
	} else {
		pass = os.Getenv("MYSQL_PASSWORD")
	}

	if os.Getenv("HOST_NAME") == "" {
		log.Print("Didn't pick up host environment variable")
		host = hostname
	} else {
		host = os.Getenv("HOST_NAME")
	}

	if os.Getenv("MYSQL_DATABASE") == "" {
		db = dbname
	} else {
		db = os.Getenv("MYSQL_DATABASE")
	}
	log.Printf("%s:%s@tcp(%s)/%s", user, pass, host, db)
	return fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", user, pass, host, db)
}
