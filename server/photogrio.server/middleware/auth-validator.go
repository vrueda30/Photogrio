package middleware

import (
	jwtmiddleware "github.com/auth0/go-jwt-middleware/v2"
	"github.com/auth0/go-jwt-middleware/v2/jwks"
	"github.com/auth0/go-jwt-middleware/v2/validator"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"
)

var (
	signingKey = []byte(os.Getenv("AUTH0_CLIENT_SECRET"))
	issuer     = os.Getenv("AUTH0_APP_DOMAIN")
	audience   = []string{os.Getenv("AUTH0_APP_AUDIENCE")}
)

func CheckJWT() gin.HandlerFunc {
	issueUrl, err := url.Parse(issuer)
	if err != nil {
		log.Printf("Failed to parse the issuer url: %v", err)
	}
	provider := jwks.NewCachingProvider(issueUrl, 5*time.Minute)

	jwtValidator, err := validator.New(
		provider.KeyFunc,
		validator.RS256,
		issueUrl.String(),
		audience,
		validator.WithCustomClaims(
			func() validator.CustomClaims {
				return &PCustomClaims{}
			},
		),
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
