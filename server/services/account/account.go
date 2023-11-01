package account

type Account struct {
	Id         string     `json:"id"`
	Membership Membership `json:"membership"`
	Owner      User       `json:"owner"`
}
