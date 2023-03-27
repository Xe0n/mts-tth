package controllers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func UploadOneFile(c *gin.Context) {
	// single file
	file, err := c.FormFile("file")
	if err != nil {
		log.Fatal(err)
	}
	log.Println(file.Filename)

	err = c.SaveUploadedFile(file, "storage/videos/src_videos/"+file.Filename)
	if err != nil {
		log.Fatal(err)
	}
	c.String(http.StatusOK, fmt.Sprintf("'%s' uploaded!", file.Filename))
}
