package database

import (
	"database/sql"
	"fmt"
	"log"
	"os"
	"time"
)

const (
	username = "photogrioapi"
	password = "irishvrlr30"
	hostname = "127.0.0.1"
	dbname   = "photogriodb"
)

var DbConn *sql.DB

func init() {

}

func dsn() string {
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

	if os.Getenv("HOST_NAME") == "" {
		host = hostname
	} else {
		host = os.Getenv("HOST_NAME")
	}

	if os.Getenv("MYSQL_DATABASE") == "" {
		db = dbname
	} else {
		db = os.Getenv("MYSQL_DATABASE")
	}

	return fmt.Sprintf("%s:%s@tcp(%s)/%s", user, pass, host, db)
}

func SetupDatabase() {
	var err error
	if err != nil {
		log.Fatal(err)
	}

	DbConn, err = sql.Open("mysql", dsn())
	if err != nil {
		log.Print(err)
	}

	DbConn.SetMaxOpenConns(3)
	DbConn.SetMaxIdleConns(3)
	DbConn.SetConnMaxLifetime(60 * time.Second)
}
