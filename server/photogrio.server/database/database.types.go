package database

import "database/sql"

type NullTime struct {
	sql.NullTime
}
