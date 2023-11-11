package middleware

import (
	"contacts.api/common"
	"contacts.api/models"
	"contacts.api/security"
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"os"
)

var Account *models.Account

func ReadCookie() gin.HandlerFunc {
	return func(context *gin.Context) {
		cookie, err := context.Cookie("account")
		log.Print()
		common.HandlePanicError(err)
		plainText := security.Decrypt([]byte(cookie), os.Getenv("SESSION_KEY"))
		err = json.Unmarshal(plainText, &Account)
		common.HandlePanicError(err)
		context.Next()
	}
}
