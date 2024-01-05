package middleware

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"job.api/common"
	"job.api/models"
	"job.api/security"
	"log"
	"os"
)

var Cookie *models.Cookie

func ReadCookie() gin.HandlerFunc {
	return func(context *gin.Context) {
		cookie, err := context.Cookie("contactapi")
		if err != nil {
			log.Printf("Error: %s", err)
		}
		log.Print(cookie)
		common.HandlePanicError(err)
		plainText := security.Decrypt([]byte(cookie), os.Getenv("SESSION_KEY"))
		err = json.Unmarshal(plainText, &Cookie)
		log.Printf("plain text: %s", plainText)
		common.HandlePanicError(err)
		log.Printf("Cookie account id: %n", Cookie.AccountId)
		context.Next()
	}
}