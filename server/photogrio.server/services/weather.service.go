package services

import (
	"encoding/json"
	"errors"
	"fmt"
	"github.com/gin-gonic/gin"
	"io"
	"log"
	"net/http"
	"os"
	"photogrio-server/common"
	"photogrio-server/middleware"
	"photogrio-server/models"
	"strconv"
	"strings"
	"time"
)

const weatherPath = "weather"

func SetupWeatherRoutes(router *gin.Engine, apiBasePath string) {
	weatherService := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, weatherPath))
	weatherService.GET(fmt.Sprintf("%s", "get_five_day_forecast"), middleware.CheckJWT(), getFiveDayForecast)
}

func getLocation(latitude float64, longitude float64) (string, error) {
	log.Printf("Latitude: %v Longitude: %v", latitude, longitude)
	var queryString = fmt.Sprintf("https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%s&q=%v,%v", os.Getenv("W_API_KEY"), latitude, longitude)
	log.Print(queryString)
	resp, err := http.Get(queryString)
	if err != nil {
		log.Print(err)
		return "", err
	}

	defer func(Body io.ReadCloser) {
		_ = Body.Close()
	}(resp.Body)
	bodyBytes, _ := io.ReadAll(resp.Body)
	log.Printf("%s", string(bodyBytes))
	var data map[string]interface{}
	err = json.Unmarshal(bodyBytes, &data)
	if err != nil {
		return "", err
	}

	rawKey, ok := data["Key"]
	if !ok {
		return "", errors.New("Unable to find location key")
	}
	key, ok := rawKey.(string)
	if !ok {
		return "", errors.New("Unable to find location key")
	}
	return key, nil
}

func getFiveDayForecast(context *gin.Context) {
	latAsString := context.Query("latitude")
	longAsString := context.Query("longitude")
	log.Printf("Parameters: %v : %v", latAsString, longAsString)
	if strings.TrimSpace(latAsString) == "" && strings.TrimSpace(longAsString) == "" {
		context.JSON(http.StatusOK, "[]")
		return
	}
	lat, _ := strconv.ParseFloat(latAsString, 32)
	long, _ := strconv.ParseFloat(longAsString, 32)
	location, err := getLocation(lat, long)
	if err != nil {
		common.HandlePanicError(err)
		context.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving weather"})
		return
	}
	var queryString = fmt.Sprintf("https://dataservice.accuweather.com/forecasts/v1/daily/5day/%s?apikey=%s", location, os.Getenv("W_API_KEY"))
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
