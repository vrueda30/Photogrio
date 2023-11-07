package middleware

import (
	"context"
	"errors"
)

type PCustomClaims struct {
	Name         string `json:"name"`
	Username     string `json:"username"`
	ShouldReject bool   `json:"shouldReject"`
}

func (c *PCustomClaims) Validate(ctx context.Context) error {
	if c.ShouldReject {
		return errors.New("should reject was set to true")
	}
	return nil
}
