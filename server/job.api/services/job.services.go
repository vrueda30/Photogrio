package services

import (
	"database/sql"
	"fmt"
	"github.com/gin-gonic/gin"
	"job.api/common"
	middleware "job.api/middelware"
	"job.api/models"
	"log"
	"net/http"
	"time"
)

const apiPath = "jobs"

func SetupRoutes(router *gin.Engine, apiBasePath string) {
	jobService := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, apiPath))
	jobService.GET(fmt.Sprintf("%s", "get_jobs"), middleware.CheckJWT(), middleware.ReadCookie(), getJobs)
	jobService.GET(fmt.Sprintf("%s", "setup_jobs"), middleware.CheckJWT(), middleware.ReadCookie(), setupJobs)
	jobService.GET(fmt.Sprintf("%s", "get_job_types"), middleware.CheckJWT(), middleware.ReadCookie(), getJobTypes)
	jobService.POST(fmt.Sprintf("%s", "createJob"), middleware.CheckJWT(), middleware.ReadCookie(), createJob)
	jobService.GET(fmt.Sprintf("%s", "get_calendar_jobs"), middleware.CheckJWT(), middleware.ReadCookie(), getCalendarJobs)
	jobService.GET(fmt.Sprintf("%s", "get_jobs_by_day"), middleware.CheckJWT(), middleware.ReadCookie(), getJobsByDay)
}

func getJobsByDay(ctx *gin.Context) {
	dateString := ctx.Query("date")
	date, err := time.Parse(time.RFC3339, dateString)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error getting jobs for the day"})
		return
	}
	jobs, err := GetJobsForDay(date, middleware.Cookie.AccountId)
	calendarViewJobs := convertToCalendarView(jobs)
	ctx.JSON(http.StatusOK, calendarViewJobs)
	return
}

func getCalendarJobs(ctx *gin.Context) {
	accountId := middleware.Cookie.AccountId
	startString := ctx.Query("start")
	start, err := time.Parse(time.RFC3339, startString)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving jobs"})
	}
	endString := ctx.Query("end")
	end, err := time.Parse(time.RFC3339, endString)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving jobs"})
	}

	jobs, err := GetJobCalendarView(start, end, accountId)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error retrieving jobs"})
		return
	}

	calendarViewJobs := convertToCalendarView(jobs)

	ctx.JSON(http.StatusOK, calendarViewJobs)
	return
}

func convertToCalendarView(jobs *[]models.Job) *[]models.JobCalendarView {
	jobCalendarView := &[]models.JobCalendarView{}
	for _, j := range *jobs {
		*jobCalendarView = append(*jobCalendarView, models.JobCalendarView{
			Id:     int(j.ID),
			Start:  j.JobDateStart.Time,
			End:    j.JobDateEnd.Time,
			Title:  j.Name,
			AllDay: j.AllDay,
		})
	}

	return jobCalendarView
}

func createJob(ctx *gin.Context) {
	var newJob *models.JobCreateDTO
	err := ctx.ShouldBindJSON(&newJob)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error creating job"})
		return
	}

	job := convertDtoToJob(newJob)
	log.Printf("Job to create: %s", job)
	err = CreateJob(job)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error creating job"})
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "success"})
	return
}

func convertDtoToJob(job *models.JobCreateDTO) *models.Job {
	newJob := &models.Job{
		JobTypeId:    job.JobType,
		JobDateStart: sql.NullTime{Time: job.JobDateStart, Valid: true},
		JobDateEnd:   sql.NullTime{Time: job.JobDateEnd, Valid: true},
		AccountId:    middleware.Cookie.AccountId,
		Name:         job.Name,
		Notes:        job.Notes,
		Location:     job.Location,
		AllDay:       job.AllDay,
		ClientId:     job.Client,
	}
	return newJob
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
