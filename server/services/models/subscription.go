package models

type SubscriptionLength int32

const (
	Monthly SubscriptionLength = iota
	Yearly
)

type Subscription struct {
	Id                 string             `json:"id"`
	Description        string             `json:"description"`
	SubscriptionLength SubscriptionLength `json:"subscriptionLength"`
	Price              float32            `json:"price"`
	IsTrial            bool               `json:"isTrial"`
}
