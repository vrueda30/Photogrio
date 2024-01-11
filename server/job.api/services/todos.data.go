package services

import (
	"job.api/data"
	"job.api/models"
)

func CreateTodo(newTodo *models.ToDo) (*models.ToDo, error) {
	res := data.DB.Create(&newTodo)
	if res.Error != nil {
		return nil, res.Error
	}

	return newTodo, nil
}

func CreateToDoList(newToDoList *models.ToDoList) (*models.ToDoList, error) {
	res := data.DB.Create(&newToDoList)
	if res.Error != nil {
		return nil, res.Error
	}

	return newToDoList, nil
}

func GetToDosForList(listId int, accountId int) (*[]models.ToDo, error) {
	toDos := &[]models.ToDo{}
	res := data.DB.Where("account_id=? AND to_do_list_id=?", accountId, listId).Find(&toDos)
	if res.Error != nil {
		return nil, res.Error
	}

	return toDos, nil
}

func GetToDoLists(accountId int) (*[]models.ToDoList, error) {
	toDoLists := &[]models.ToDoList{}
	res := data.DB.Where("account_id=?", accountId).Order("name asc").Find(&toDoLists)
	if res.Error != nil {
		return nil, res.Error
	}

	return toDoLists, nil
}

func DeleteToDoList(listId int, accountId int) error {
	res := data.DB.Where("account_id=? AND to_do_list_id=?", accountId, listId).Delete(&models.ToDo{})
	if res.Error != nil {
		return res.Error
	}
	res = data.DB.Delete(&models.ToDoList{}, listId)
	if res.Error != nil {
		return res.Error
	}
	return nil
}
