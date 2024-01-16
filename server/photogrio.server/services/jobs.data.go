package services

import (
	"log"
	"photogrio-server/database"
	"photogrio-server/models"
	"time"
)

func SeedJobTypesForAccount(seedJobs []*models.JobType) error {
	if res := database.DB.Create(&seedJobs); res.Error != nil {
		return res.Error
	}
	return nil
}

func GetJobCalendarView(start time.Time, end time.Time, accountId int) (*[]models.Job, error) {
	var jobs = &[]models.Job{}
	res := database.DB.Where("job_date_start >= ? AND job_date_end <= ? AND account_id = ?", start, end, accountId).
		Find(jobs)
	if res.Error != nil {
		return nil, res.Error
	}

	return jobs, nil
}

func GetJobsForDay(date time.Time, accountId int) (*[]models.Job, error) {
	endDate := date.Add(time.Hour * 24)
	log.Printf("End date: %v AccountId: %d", endDate, accountId)
	var jobs = &[]models.Job{}
	res := database.DB.Where("job_date_start >= ? AND job_date_start <= ? AND account_id = ?", date, endDate, accountId).
		Find(jobs)
	if res.Error != nil {
		log.Printf(res.Error.Error())
		return nil, res.Error
	}
	log.Printf("Found jobs: %v for date:%v", jobs, date)
	return jobs, nil
}

func GetJobTypes(accountId int) ([]models.JobType, error) {
	var jobTypes = &[]models.JobType{}
	res := database.DB.Where("account_id=?", accountId).Find(jobTypes)
	if res.Error != nil {
		log.Printf("Error retreiving job types: %s", res.Error)
		return nil, res.Error
	}

	return *jobTypes, nil
}

func CreateJob(job *models.Job) error {
	log.Print("Creating job")
	res := database.DB.Create(job)
	if res.Error != nil {
		log.Printf("Error creating jobs")
		return res.Error
	}

	return nil
}
