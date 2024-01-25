package services

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"photogrio-server/common"
	"photogrio-server/database"
	"photogrio-server/middleware"
	"photogrio-server/models"
	"strconv"
)

const toDoPath = "todos"

func SetupTODORoutes(router *gin.Engine, apiBasePath string) {
	toDoRoute := router.Group(fmt.Sprintf("%s/%s/", apiBasePath, toDoPath))
	toDoRoute.POST(fmt.Sprintf("%s", "create_todo"), middleware.CheckJWT(), middleware.ReadCookie(), createTodo)
	toDoRoute.POST(fmt.Sprintf("%s", "create_todo_list"), middleware.CheckJWT(), middleware.ReadCookie(), createToDoList)
	toDoRoute.GET(fmt.Sprintf("%s", "get_todo_lists"), middleware.CheckJWT(), middleware.ReadCookie(), getToDoLists)
	toDoRoute.DELETE(fmt.Sprintf("%s", "delete_todo_list"), middleware.CheckJWT(), middleware.ReadCookie(), deleteToDoList)
	toDoRoute.GET(fmt.Sprintf("%s", "get_todos_for_list"), middleware.CheckJWT(), middleware.ReadCookie(), getTodosForList)
	toDoRoute.PATCH(":id", middleware.CheckJWT(), middleware.ReadCookie(), updateTodDo)
}

func updateTodDo(ctx *gin.Context) {
	accountId := middleware.AccountCookie.AccountId
	var toDo *models.UpdateToDo
	if err := ctx.ShouldBindJSON(&toDo); err != nil {
		handleError(err, ctx)
		common.SendBadRequest(ctx, "Update failed")
		return
	}
	toDoId, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		log.Print(err)
	}

	log.Printf("todo: %d", toDoId)

	if err := UpdateToDo(toDo, toDoId, accountId); err != nil {
		handleError(err, ctx)
		common.SendBadRequest(ctx, "Update failed")
		return
	}
	ctx.JSON(http.StatusOK, toDo)
	return
}

func getTodosForList(ctx *gin.Context) {
	listId, err := strconv.Atoi(ctx.Query("listid"))
	if err != nil {
		common.HandlePanicError(err)
		common.SendBadRequest(ctx, "Error retrieving todos")
		return
	}
	accountId := middleware.AccountCookie.AccountId
	todos, err := GetToDosForList(listId, accountId)
	if err != nil {
		common.HandlePanicError(err)
		common.SendBadRequest(ctx, "Error retrieving todos")
		return
	}

	ctx.JSON(http.StatusOK, todos)
	return
}

func deleteToDoList(ctx *gin.Context) {
	listIdq := ctx.Query("listid")
	listId, err := strconv.Atoi(listIdq)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error deleting to-do list"})
		return
	}
	accountId := middleware.AccountCookie.AccountId
	err = DeleteToDoList(listId, accountId)
	if err != nil {
		common.HandlePanicError(err)
		common.SendBadRequest(ctx, "Error deleting to-do-list")
		return
	}
	ctx.JSON(http.StatusOK, gin.H{"status": "deleted"})
	return
}

func getToDoLists(ctx *gin.Context) {
	accountId := middleware.AccountCookie.AccountId
	res, err := GetToDoLists(accountId)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error retieving to do lists"})
		return
	}

	ctx.JSON(http.StatusOK, res)
	return
}

func createToDoList(ctx *gin.Context) {
	accountId := middleware.AccountCookie.AccountId
	newToDoList := &models.ToDoList{}
	err := ctx.ShouldBindJSON(newToDoList)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error creating ToDo list"})
		return
	}
	newToDoList.AccountId = accountId

	newToDoList, err = CreateToDoList(newToDoList)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error creating ToDo list"})
		return
	}
	ctx.JSON(http.StatusCreated, newToDoList)

	return
}

func createTodo(ctx *gin.Context) {
	accountId := middleware.AccountCookie.AccountId
	newTodo := &models.ToDo{}
	err := ctx.ShouldBindJSON(newTodo)
	if newTodo.ContactId.Int64 <= 0 {
		newTodo.ContactId = database.NullInt64{}
	}

	log.Printf("model: %v", newTodo)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error creating todo"})
		return
	}
	newTodo.AccountId = accountId
	task, err := CreateTodo(newTodo)
	if err != nil {
		common.HandlePanicError(err)
		ctx.JSON(http.StatusBadRequest, gin.H{"error": "Error creating todo"})
		return
	}

	ctx.JSON(http.StatusCreated, task)
	return
}
