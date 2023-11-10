package models

import (
	db "server/database"
)

type Membership struct {
	Id             string       `json:"id"`
	SubscriptionId Subscription `json:"subscriptionId"`
	ActivationDate db.NullTime  `json:"activationDate"`
	ExpirationDate db.NullTime  `json:"expirationDate"`
	AutoRenew      bool         `json:"autoRenew"`
}
