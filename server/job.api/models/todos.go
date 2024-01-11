package models

import (
	"gorm.io/gorm"
)

type ToDo struct {
	gorm.Model
	Name       string   `json:"name"`
	Completed  bool     `json:"completed", gorm:"default:false"`
	DueDate    NullTime `json:"dueDate"`
	AccountId  int      `json:"accountId"`
	ToDoListId int      `json:"toDoListId"`
	ToDoList   ToDoList `json:"toDoList"`
	Notes      string   `json:"notes"`
}

type ToDoList struct {
	gorm.Model
	Name      string `json:"name"`
	AccountId int    `json:"accountId"`
}
