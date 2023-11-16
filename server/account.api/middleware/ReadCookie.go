package middleware

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"server/common"
	"server/security"
	"server/services/models"
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
