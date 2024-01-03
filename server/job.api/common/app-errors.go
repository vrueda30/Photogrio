package common

import "log"

func HandlePanicError(err error) {
	if err != nil {
		log.Print(err)
		panic(err.Error)
	}
}

func HandleError(err error) {
	if err != nil {
		log.Print(err)
	}
}
