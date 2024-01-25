package models

import (
	"gorm.io/gorm"
	"photogrio-server/database"
)

type ToDo struct {
	gorm.Model
	Name       string             `json:"name"`
	Completed  bool               `json:"completed" gorm:"default:false"`
	DueDate    database.NullTime  `json:"dueDate"`
	AccountId  int                `json:"accountId"`
	ToDoListId int                `json:"toDoListId"`
	ToDoList   ToDoList           `json:"toDoList"`
	ContactId  database.NullInt64 `json:"contactId"`
	Contact    Contact            `json:"contact"`
	Notes      string             `json:"notes"`
}

type ToDoList struct {
	gorm.Model
	Name      string `json:"name"`
	AccountId int    `json:"accountId"`
}

type UpdateToDo struct {
	Name      string             `json:"name"`
	Completed bool               `json:"completed"`
	ContactId database.NullInt64 `json:"contactId"`
}
