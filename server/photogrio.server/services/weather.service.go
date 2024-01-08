package services

import (
	"encoding/json"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"photogrio-server/middleware"
	"photogrio-server/services/models"
)

const weatherPath = "weather"

func SetupWeatherRoutes(router *gin.Engine, apiBasePath string) {
	weatherService := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, weatherPath))
	weatherService.GET(fmt.Sprintf("%s", "get_five_day_forecast"), middleware.CheckJWT(), getFiveDayForecast)
}

func getFiveDayForecast(context *gin.Context) {
	var queryString = "https://dataservice.accuweather.com/forecasts/v1/daily/5day/23108_PC?apikey=oAuXGwFHE4Na0mnGFMUqmvRXBroYTpKD"
	resp, error := http.Get(queryString)
	if error != nil {
		log.Print(error.Error())
		context.JSON(http.StatusBadRequest, gin.H{"error": error})
		return
	}

	defer resp.Body.Close()
	bodyBytes, _ := io.ReadAll(resp.Body)
	var weatherForecast models.WeatherDTO
	log.Print(resp.StatusCode)
	log.Print(resp.Status)
	if resp.StatusCode != 200 {
		var errMessage *models.ErrorResponse = &models.ErrorResponse{}
		err := json.Unmarshal(bodyBytes, errMessage)
		if err != nil {
			log.Print(err)
		} else {
			log.Print(errMessage)
		}
	}
	err := json.Unmarshal(bodyBytes, &weatherForecast)
	if err != nil {
		log.Print(err)
	}

	context.JSON(http.StatusOK, weatherForecast.DailyForecasts)
	return
}
