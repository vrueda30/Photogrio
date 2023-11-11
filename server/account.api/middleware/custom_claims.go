package middleware

import (
	"context"
)

type PCustomClaims struct {
	Scope string `json:"scope"`
}

func (c *PCustomClaims) Validate(ctx context.Context) error {
	return nil
}
