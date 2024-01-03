package services

import (
	"job.api/data"
	"job.api/models"
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
		return nil, res.Error
	}

	return *jobTypes, nil
}
