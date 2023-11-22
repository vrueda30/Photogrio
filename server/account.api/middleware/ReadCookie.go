package middleware

import (
	"account.api/common"
	"account.api/security"
	"account.api/services/models"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"os"
)

var Account *models.Account

func ReadCookie() gin.HandlerFunc {
	return func(context *gin.Context) {
		cookie, err := context.Cookie("account")
		common.HandlePanicError(err)
		plainText := security.Decrypt([]byte(cookie), os.Getenv("SESSION_KEY"))
		err = json.Unmarshal(plainText, &Account)
		if err != nil {
			log.Print(err)
		}
		common.HandlePanicError(err)
		context.Next()
	}
}
