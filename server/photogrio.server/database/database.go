package database

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
	dsn := Dsn()
	gdb, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Println(err)
	}
	DB = gdb
}

func Dsn() string {
	var user string
	var pass string
	var host string
	var db string

	if os.Getenv("MYSQL_USER") == "" {
		user = username
	} else {
		user = os.Getenv("MYSQL_USER")
	}

	if os.Getenv("MYSQL_PASSWORD") == "" {
		pass = password
	} else {
		pass = os.Getenv("MYSQL_PASSWORD")
	}

	if os.Getenv("DB_HOST_NAME") == "" {
		log.Print("Didn't pick up host environment variable")
		host = hostname
	} else {
		host = os.Getenv("DB_HOST_NAME")
	}

	if os.Getenv("MYSQL_DATABASE") == "" {
		db = dbname
	} else {
		db = os.Getenv("MYSQL_DATABASE")
	}
	log.Printf("%s:%s@tcp(%s)/%s", user, pass, host, db)
	return fmt.Sprintf("%s:%s@tcp(%s)/%s?parseTime=true", user, pass, host, db)
}
