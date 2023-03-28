package models

type VideoItem struct {
	ID               string `json:"pk"`
	Name             string `json:"name"`
	ShortDescription string `json:"short_description"`
	FullDescription  string `json:"full_description"`
	CreatedAt        string `json:"created_at"`
	ConvertedToHls   string `json:"converted_to_hls"`
	SafeVersion      bool   `json:"safe_version"`
}

type VideoItemList struct {
	VideoItems []VideoItem `json:"items"`
}
