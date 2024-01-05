package services

import (
	"job.api/data"
	"job.api/models"
	"log"
)

func SeedJobTypesForAccount(seedJobs []*models.JobType) error {
	if res := data.DB.Create(&seedJobs); res.Error != nil {
		return res.Error
	}
	return nil
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
