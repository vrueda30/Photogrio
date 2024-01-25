package database

import (
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"
)

type NullInt64 sql.NullInt64 /*struct {
	sql.NullInt64
}*/

func (ni *NullInt64) Scan(value interface{}) error {
	n := sql.NullInt64{Int64: ni.Int64}
	err := n.Scan(value)
	ni.Int64, ni.Valid = n.Int64, n.Valid
	return err
}

func (ni NullInt64) Value() (driver.Value, error) {
	if !ni.Valid {
		return nil, nil
	}

	return ni.Int64, nil
}

func (ni *NullInt64) UnmarshalJSON(b []byte) error {
	s := string(b)
	ni.Valid = true
	if s == "null" {
		ni.Valid = false
		return nil
	}
	i, err := strconv.ParseInt(s, 10, 64)
	if err != nil {
		ni.Valid = false
		return err
	}
	ni.Int64 = i
	return nil
}

func (ni *NullInt64) MarshalJSON() ([]byte, error) {
	if !ni.Valid {
		return json.Marshal(nil)
	}
	return json.Marshal(ni.Int64)
}

type NullTime struct {
	sql.NullTime
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

func (nd *NullTime) UnmarshalJSON(b []byte) error {
	s := string(b)
	s = strings.ReplaceAll(s, "\"", "")
	x, err := time.Parse(time.RFC3339, s)
	if err != nil {
		nd.Valid = false
		return err
	}

	nd.Time = x
	nd.Valid = true
	return nil
}

func (nd *NullTime) MarshalJSON() ([]byte, error) {
	if !nd.Valid {
		return []byte("null"), nil
	}
	val := fmt.Sprintf("\"%s\"", nd.Time)
	return []byte(val), nil
}
