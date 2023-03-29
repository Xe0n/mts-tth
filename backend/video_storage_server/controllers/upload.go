package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yud-warrior/video-storage-server/db"
	"github.com/yud-warrior/video-storage-server/domain"
	"github.com/yud-warrior/video-storage-server/models"
)

func UploadOneFile(c *gin.Context) {
	// single file
	var videoItem models.VideoItem
	database := c.MustGet("dbConn").(db.Database)
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "request should contain file"})
		return
	}

	log.Println(file.Filename)

	videoItem.Name = c.Query("name")
	videoItem.ShortDescription = c.Query("short_description")
	videoItem.FullDescription = c.Query("full_description")
	log.Println(videoItem.Name)
	log.Println(videoItem.ShortDescription)
	log.Println(videoItem.FullDescription)

	videoItemInDb, err := database.GetVideoItemByName(videoItem.Name)
	log.Println(err)
	if err != db.ErrNoMatch && err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	} else if err == nil {
		c.JSON(http.StatusAlreadyReported, gin.H{"error": fmt.Sprintf("'%s' already in db!", videoItemInDb.Name)})
		return
	}

	log.Println("checkpoint")

	err = c.SaveUploadedFile(file, "storage/videos/src_videos/"+file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "saving file error"})
		return
	}

	videoItem.ConvertedToHls = false

	err = database.AddVideoItem(&videoItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	go domain.MakeHlsFromSrc(database, videoItem)

	c.JSON(http.StatusOK, gin.H{"ok": fmt.Sprintf("'%s' uploaded!", file.Filename)})
}

func UploadOneSafeFile(c *gin.Context) {
	// single safe file
	var videoItem models.VideoItem
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "request should contain file"})
		return
	}
	database := c.MustGet("dbConn").(db.Database)

	log.Println(file.Filename)

	videoItem.Name = c.Query("name")
	videoItem.ShortDescription = c.Query("short_description")
	videoItem.FullDescription = c.Query("full_description")

	videoItemInDb, err := database.GetVideoItemByName(videoItem.Name)
	if err != db.ErrNoMatch && err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	} else if err == nil && videoItem.SafeVersion {
		c.JSON(http.StatusAlreadyReported, gin.H{"error": fmt.Sprintf("'%s' already in db!", videoItemInDb.Name)})
		return
	} else if err == db.ErrNoMatch {
		videoItem.ConvertedToHls = false
		err = database.AddVideoItem(&videoItem)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
			return
		}
	}

	err = c.SaveUploadedFile(file, "storage/videos/safe/src_videos/"+file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "database error"})
		return
	}

	go domain.MakeHlsFromSrc(database, videoItem)

	c.JSON(http.StatusOK, gin.H{"ok": fmt.Sprintf("'%s' uploaded!", file.Filename)})
}
