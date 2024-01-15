package models

type Headline struct {
	EffectiveDate      string
	EffectiveEpochDate int
	Severity           int
	Text               string
	Category           string
	EndDate            string
	EndEpochDate       int
	MobileLink         string
	Link               string
}

type WeatherDTO struct {
	Headline       Headline
	DailyForecasts []Forecast
}

type WeatherScreenDTO struct {
	FiveDayForecast []Forecast `json:"fiveDayForecast"`
}

type Forecast struct {
	Date        string
	EpochDate   int32
	Temperature Temperature
	Day         DayNight
	Night       DayNight
	Sources     []string
	MobileLink  string
	Link        string
}

type DayNight struct {
	Icon             int32
	IconPhrase       string
	HasPrecipitation bool
}

type Temperature struct {
	Minimum Temp
	Maximum Temp
}

type Temp struct {
	Value    float32
	Unit     string
	UnitType int32
}

type ErrorResponse struct {
	Code      string
	Message   string
	Reference string
}
