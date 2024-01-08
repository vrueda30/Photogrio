package middleware

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"log"
	"os"
	"photogrio-server/common"
	"photogrio-server/security"
	"photogrio-server/services/models"
)

var Account *models.UserSessionInfo

func ReadCookie() gin.HandlerFunc {
	return func(context *gin.Context) {
		cookie, err := context.Cookie("account")
		common.HandlePanicError(err)
		log.Printf("Decrypting cookie: %s", cookie)
		session_key := os.Getenv("SESSION_KEY")
		log.Printf("Session key: %s", session_key)
		plainText := security.Decrypt([]byte(cookie), session_key)
		err = json.Unmarshal(plainText, &Account)
		if err != nil {
			log.Printf("Error unmarshaling cookie: %s", err)
		}
		log.Printf("Plain text: %s", Account)
		common.HandlePanicError(err)
		context.Next()
	}
}
