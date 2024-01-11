package services

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"photogrio-server/common"
	"photogrio-server/middleware"
	"photogrio-server/services/models"
	"time"
)

const weatherPath = "weather"

func SetupWeatherRoutes(router *gin.Engine, apiBasePath string) {
	weatherService := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, weatherPath))
	weatherService.GET(fmt.Sprintf("%s", "get_five_day_forecast"), middleware.CheckJWT(), getFiveDayForecast)
}

func getFiveDayForecast(context *gin.Context) {
	var queryString = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/23108_PC?apikey=oAuXGwFHE4Na0mnGFMUqmvRXBroYTpKD"
	log.Printf("Start get five day forecase: %s", time.Now())
	resp, err := http.Get(queryString)
	if err != nil {
		log.Print(err.Error())
		context.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			common.HandlePanicError(err)
		}
	}(resp.Body)
	bodyBytes, _ := io.ReadAll(resp.Body)
	var weatherForecast models.WeatherDTO
	if resp.StatusCode != 200 {
		var errMessage *models.ErrorResponse = &models.ErrorResponse{}
		err := json.Unmarshal(bodyBytes, errMessage)
		if err != nil {
			log.Print(err)
		} else {
			log.Print(errMessage)
		}
	}
	err = json.Unmarshal(bodyBytes, &weatherForecast)
	if err != nil {
		log.Print(err)
	}

	context.JSON(http.StatusOK, weatherForecast.DailyForecasts)
	log.Printf("End get five day forecase: %s", time.Now())
	return
}
