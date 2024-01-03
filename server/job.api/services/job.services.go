package services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"job.api/common"
	middleware "job.api/middelware"
	"job.api/models"
	"net/http"
)

const apiPath = "jobs"

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	jobService := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, apiPath))
	jobService.GET(fmt.Sprintf("%s", "get_jobs"), middleware.CheckJWT(), middleware.ReadCookie(), getJobs)
	jobService.GET(fmt.Sprintf("%s", "setup_jobs"), middleware.CheckJWT(), middleware.ReadCookie(), setupJobs)
	jobService.GET(fmt.Sprintf("%s", "get_job_types"), middleware.CheckJWT(), middleware.ReadCookie(), getJobTypes)
}

func getJobTypes(ctx *gin.Context) {
	accountId := middleware.Cookie.AccountId
	jobTypes, err := GetJobTypes(accountId)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	ctx.JSON(http.StatusOK, jobTypes)
}

func setupJobs(ctx *gin.Context) {
	accountId := middleware.Cookie.AccountId
	err := seedJobTypes(accountId)
	if err != nil {
		common.HandleError(err)
		ctx.JSON(http.StatusBadRequest, gin.Error{Err: err})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "complete"})
}

func seedJobTypes(accountId int) error {
	jobs := []*models.JobType{}
	jobs = append(jobs, &models.JobType{AccountId: accountId, Name: "Wedding"})
	jobs = append(jobs, &models.JobType{AccountId: accountId, Name: "Portrait"})
	jobs = append(jobs, &models.JobType{AccountId: accountId, Name: "Head Shot"})
	jobs = append(jobs, &models.JobType{AccountId: accountId, Name: "Engagement"})
	jobs = append(jobs, &models.JobType{AccountId: accountId, Name: "Other"})
	err := SeedJobTypesForAccount(jobs)

	return err
}

func getJobs(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{"status": "ok"})
	return
}
