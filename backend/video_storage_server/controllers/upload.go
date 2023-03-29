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

type UploadFileError struct {
	Error string `json:"error"`
}

type SuccessfulUpload struct {
	Ok string `json:"ok"`
}

// UploadOneFile godoc
//
//	@Summary		Uploading unsafe file
//	@Description	Uploading unsafe video file on the server
//	@Tags			upload
//	@Accept			json
//	@Produce		json
//	@Param			file	formData		file	true	"File to upload"
//	@Param			name	query	string	  true	"Name of the video"
//	@Param			short_description	query	string	  true	"Short description of the video"
//	@Param			full_description	query	string	  true	"Full description of the video"
//	@Success		200	{object}	SuccessfulUpload
//	@Success		208	{object}	SuccessfulUpload
//	@Failure		400	{object}    UploadFileError
//	@Failure		500	{object}    UploadFileError
//	@Router			/upload [post]
func UploadOneFile(c *gin.Context) {
	// single file
	var videoItem models.VideoItem
	database := c.MustGet("dbConn").(db.Database)
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, UploadFileError{"request should contain file"})
		return
	}

	log.Println(file.Filename)

	videoItem.Name = c.Query("name")
	videoItem.ShortDescription = c.Query("short_description")
	videoItem.FullDescription = c.Query("full_description")

	videoItemInDb, err := database.GetVideoItemByName(videoItem.Name)
	if err != db.ErrNoMatch && err != nil {
		c.JSON(http.StatusInternalServerError, UploadFileError{"database error"})
		return
	} else if err == nil {
		c.JSON(http.StatusAlreadyReported, SuccessfulUpload{fmt.Sprintf("'%s' already in db!", videoItemInDb.Name)})
		return
	}

	err = c.SaveUploadedFile(file, "storage/videos/src_videos/"+file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, UploadFileError{"saving file error"})
		return
	}

	videoItem.ConvertedToHls = false

	err = database.AddVideoItem(&videoItem)
	if err != nil {
		c.JSON(http.StatusInternalServerError, UploadFileError{"database error"})
		return
	}

	go domain.MakeHlsFromSrc(database, videoItem)

	c.JSON(http.StatusOK, SuccessfulUpload{fmt.Sprintf("'%s' uploaded!", file.Filename)})
}

// UploadOneSafeFile godoc
//
//	@Summary		Uploading safe file
//	@Description	Uploading safe video file on the server
//	@Tags			upload
//	@Accept			json
//	@Produce		json
//	@Param			file	formData		file	true	"File to upload"
//	@Param			name	query	string	  true	"Name of the video"
//	@Param			short_description	query	string	  true	"Short description of the video"
//	@Param			full_description	query	string	  true	"Full description of the video"
//	@Success		200	{object}	SuccessfulUpload
//	@Success		208	{object}	SuccessfulUpload
//	@Failure		400	{object}    UploadFileError
//	@Failure		500	{object}    UploadFileError
//	@Router			/safe/upload [post]
func UploadOneSafeFile(c *gin.Context) {
	// single safe file
	var videoItem models.VideoItem
	file, err := c.FormFile("file")
	if err != nil {
		c.JSON(http.StatusBadRequest, UploadFileError{"request should contain file"})
		return
	}
	database := c.MustGet("dbConn").(db.Database)

	log.Println(file.Filename)

	videoItem.Name = c.Query("name")
	videoItem.ShortDescription = c.Query("short_description")
	videoItem.FullDescription = c.Query("full_description")

	videoItemInDb, err := database.GetVideoItemByName(videoItem.Name)
	if err != db.ErrNoMatch && err != nil {
		c.JSON(http.StatusInternalServerError, UploadFileError{"database error"})
		return
	} else if err == nil && videoItem.SafeVersion {
		c.JSON(http.StatusAlreadyReported, SuccessfulUpload{fmt.Sprintf("'%s' already in db!", videoItemInDb.Name)})
		return
	} else if err == db.ErrNoMatch {
		videoItem.ConvertedToHls = false
		err = database.AddVideoItem(&videoItem)
		if err != nil {
			c.JSON(http.StatusInternalServerError, UploadFileError{"database error"})
			return
		}
	}

	err = c.SaveUploadedFile(file, "storage/videos/safe/src_videos/"+file.Filename)
	if err != nil {
		c.JSON(http.StatusInternalServerError, UploadFileError{"database error"})
		return
	}

	go domain.MakeHlsFromSrc(database, videoItem)

	c.JSON(http.StatusOK, SuccessfulUpload{fmt.Sprintf("'%s' uploaded!", file.Filename)})
}
