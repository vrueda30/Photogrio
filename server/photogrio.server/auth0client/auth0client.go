package auth0client

import (
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"strings"
)

const SignupUrl = "https://photogrio.auth0.com/api/v2/users"

type AuthError struct {
	statusCode int    `json:"statusCode"`
	error      string `json:"error"`
	message    string `json:"message"`
	errorCode  string `json:"errorCode"`
}

type AuthToken struct {
	AccessToken string `json:"access_token"`
	TokenType   string `json:"token_type"`
}

type SignupUserDTO struct {
	Email      string `json:"email"`
	Password   string `json:"password"`
	Connection string `json:"connection"`
	Name       string `json:"name"`
}

var (
	authToken AuthToken
)

var (
	clientId, clientSecret, audience, url, connection string
)

func init() {
	clientId = os.Getenv("AUTH0_CLIENT_ID")
	clientSecret = os.Getenv("AUTH0_CLIENT_SECRET")
	audience = os.Getenv("AUTH0_API_AUDIENCE")
	url = os.Getenv("AUTH0_AUTHORIZATION_URI")
	connection = os.Getenv("AUTH0_CONNECTION")
}

func GetAccessToken() AuthToken {
	var token AuthToken
	payload := fmt.Sprintf("{\"client_id\":\"%s\",\"client_secret\":\"%s\",\"audience\":\"%s\",\"grant_type\":\"client_credentials\"}", clientId, clientSecret, audience)
	payloadReader := strings.NewReader(payload)

	req, _ := http.NewRequest("POST", url, payloadReader)
	req.Header.Add("content-type", "application/json")
	res, err := http.DefaultClient.Do(req)
	defer res.Body.Close()
	if err != nil {
		log.Print(err)
	}
	body, err := io.ReadAll(res.Body)
	if err != nil {
		log.Print(err)
	}

	err = json.Unmarshal(body, &token)
	if err != nil {
		log.Print(err)
	}
	b := string(body)
	log.Print(b)
	return token
}

func SignUp(user SignupUserDTO) (userId *string, err error) {
	authToken = GetAccessToken()

	user.Connection = connection
	var data []byte
	var req *http.Request
	var res *http.Response
	data, err = json.Marshal(user)

	dataReader := strings.NewReader(string(data))
	if err != nil {
		log.Print(err)
		return nil, err
	}

	bearer := fmt.Sprintf("%s %s", authToken.TokenType, authToken.AccessToken)
	req, err = http.NewRequest("POST", SignupUrl, dataReader)
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Authorization", bearer)
	res, err = http.DefaultClient.Do(req)
	defer res.Body.Close()

	if err != nil {
		log.Print(err)
		return nil, err
	}

	if res.StatusCode != http.StatusCreated {
		body, err := io.ReadAll(res.Body)
		if err != nil {
			log.Print(err)
		}
		log.Print(string(body))
		return nil, errors.New(string(body))
	}

	var body []byte
	body, err = io.ReadAll(res.Body)
	if err != nil {
		log.Print(err)
		return nil, err
	}

	var resData map[string]interface{}
	json.Unmarshal(body, &resData)
	id := resData["user_id"].(string)
	return &id, nil
}
