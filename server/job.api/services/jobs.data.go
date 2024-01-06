package services

import (
	"job.api/data"
	"job.api/models"
	"log"
	"time"
)

func SeedJobTypesForAccount(seedJobs []*models.JobType) error {
	if res := data.DB.Create(&seedJobs); res.Error != nil {
		return res.Error
	}
	return nil
}

func GetJobCalendarView(start time.Time, end time.Time, accountId int) (*[]models.Job, error) {
	var jobs = &[]models.Job{}
	res := data.DB.Where("job_date_start >= ? AND job_date_end <= ? AND account_id = ?", start, end, accountId).
		Find(jobs)
	if res.Error != nil {
		return nil, res.Error
	}

	return jobs, nil
}

func GetJobTypes(accountId int) ([]models.JobType, error) {
	var jobTypes = &[]models.JobType{}
	res := data.DB.Where("account_id=?", accountId).Find(jobTypes)
	if res.Error != nil {
		log.Printf("Error retreiving job types: %s", res.Error)
		return nil, res.Error
	}

	return *jobTypes, nil
}

func CreateJob(job *models.Job) error {
	log.Print("Creating job")
	res := data.DB.Create(job)
	if res.Error != nil {
		log.Printf("Error creating jobs")
		return res.Error
	}

	return nil
}
