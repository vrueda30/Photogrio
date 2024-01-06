package database

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"os"
	"time"
)

const (
	username = "photogrioapi"
	password = "irishvrlr30"
	hostname = "photogriodb"
	dbname   = "photogriodb"
)

var DbConn *sql.DB

func init() {

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

func SetupDatabase() {
	var err error
	if err != nil {
		log.Fatal(err)
	}

	DbConn, err = sql.Open("mysql", Dsn())
	if err != nil {
		log.Print(err)
	}

	DbConn.SetMaxOpenConns(3)
	DbConn.SetMaxIdleConns(3)
	DbConn.SetConnMaxLifetime(60 * time.Second)
}
