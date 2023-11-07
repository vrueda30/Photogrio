package middleware

import (
	"context"
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"time"
)

var (
	signingKey = []byte(os.Getenv("AUTH0_CLIENT_SECRET"))
	issuer     = "https://" + os.Getenv("AUTH0_DOMAIN") + "/"
	audience   = []string{os.Getenv("AUTH0_AUDIENCE")}

	keyFunc = func(ctx context.Context) (interface{}, error) {
		return signingKey, nil
	}

	customClaims = func() validator.CustomClaims {
		return &PCustomClaims{}
	}
)

func checkJWT() gin.HandlerFunc {
	jwtValidator, err := validator.New(
		keyFunc,
		validator.RS256,
		issuer,
		audience,
		validator.WithCustomClaims(customClaims),
		validator.WithAllowedClockSkew(30*time.Second),
	)
	if err != nil {
		log.Fatalf("failed to set up the validator: %v", err)
	}

	errorHandler := func(w http.ResponseWriter, r *http.Request, err error) {
		log.Printf("Encountered error while validating JWT: %v", err)
	}

	middleware := jwtmiddleware.New(
		jwtValidator.ValidateToken,
		jwtmiddleware.WithErrorHandler(errorHandler),
	)

	return func(ctx *gin.Context) {
		encounteredError := true
		var handler http.HandlerFunc = func(w http.ResponseWriter, r *http.Request) {
			encounteredError = false
			ctx.Request = r
			ctx.Next()
		}

		middleware.CheckJWT(handler).ServeHTTP(ctx.Writer, ctx.Request)

		if encounteredError {
			ctx.AbortWithStatusJSON(
				http.StatusUnauthorized,
				map[string]string{"message": "JWT is invalid"},
			)
		}
	}

}
