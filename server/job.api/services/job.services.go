package services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	middleware "job.api/middelware"
	"net/http"
)

const apiPath = "jobs"

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	schedulingService := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, apiPath))
	schedulingService.GET(fmt.Sprintf("%s", "get_five_day_forecast"), middleware.CheckJWT(), getJobs)
}

func getJobs(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	return
}
