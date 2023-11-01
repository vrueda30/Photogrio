package account

import (
	"database/sql"
)

type NullTime struct {
	sql.NullTime
}

type Membership struct {
	Id             string       `json:"id"`
	SubscriptionId Subscription `json:"subscriptionId"`
	ActivationDate NullTime     `json:"activationDate"`
	ExpirationDate NullTime     `json:"expirationDate"`
	AutoRenew      bool         `json:"autoRenew"`
}
