package models

type Account struct {
	Id int `json:"id"`
}

type Cookie struct {
	Name      string `json:"name"`
	AccountId int    `json:"accountId"`
	UserId    int    `json:"userId"`
}
