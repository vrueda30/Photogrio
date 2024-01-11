package models

import (
	"database/sql/driver"
	"fmt"
	"strings"
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
