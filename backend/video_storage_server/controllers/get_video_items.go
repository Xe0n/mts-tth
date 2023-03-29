package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yud-warrior/video-storage-server/db"
	"github.com/yud-warrior/video-storage-server/models"
)

type ItemsError struct {
	Error string `json:"error"`
}

// GetLastNVideoItems godoc
//
//	@Summary		Last number_of_videos created Video Items
//	@Description	get VideoItemsList by number_of_videos (int)
//	@Tags			videolist
//	@Accept			json
//	@Produce		json
//	@Param			number_of_videos	query	int	  true	"Number of last videos to represent"
//	@Success		200	{object}	models.VideoItemList
//	@Failure		400	{object}    ItemsError
//	@Failure		500	{object}    ItemsError
//	@Router			/videolist/lastn [get]
func GetLastNVideoItems(c *gin.Context) {
	var videoItems *models.VideoItemList
	database := c.MustGet("dbConn").(db.Database)
	num, err := strconv.Atoi(c.Query("number_of_videos"))
	if err != nil {
		c.JSON(http.StatusBadRequest, ItemsError{"number_of_videos integer required"})
		return
	}
	videoItems, err = database.GetLastNVideoItems(num)
	if err != nil {
		c.JSON(http.StatusInternalServerError, ItemsError{"server presentation error"})
		return
	}
	c.JSON(http.StatusOK, videoItems)
}

// GetAllVideoItems godoc
//
//	@Summary		All the video items
//	@Description	get VideoItemsList of the all items
//	@Tags			videolist
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	models.VideoItemList
//	@Failure		500	{object}    ItemsError
//	@Router			/videolist/all [get]
func GetAllVideoItems(c *gin.Context) {
	var videoItems *models.VideoItemList
	database := c.MustGet("dbConn").(db.Database)

	videoItems, err := database.GetAllVideoItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, ItemsError{"server presentation error"})
		return
	}
	c.JSON(http.StatusOK, videoItems)
}
