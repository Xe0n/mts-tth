package controllers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/yud-warrior/video-storage-server/db"
)

func GetLastNVideoItems(c *gin.Context) {
	database := c.MustGet("dbConn").(db.Database)
	num, err := strconv.Atoi(c.Query("number_of_videos"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "number_of_videos integer required"})
		return
	}
	videoItems, err := database.GetLastNVideoItems(num)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server presentation error"})
		return
	}
	c.JSON(http.StatusOK, videoItems)
}

func GetAllVideoItems(c *gin.Context) {
	database := c.MustGet("dbConn").(db.Database)

	videoItems, err := database.GetAllVideoItems()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "server presentation error"})
		return
	}
	c.JSON(http.StatusOK, videoItems)
}
