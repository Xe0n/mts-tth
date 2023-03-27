package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yud-warrior/video-storage-server/controllers"
	"github.com/yud-warrior/video-storage-server/middlewares"
)

func main() {
	router := gin.Default()
	r := router.Group("/api/v1")
	r.Use(middlewares.CORSMiddleware())
	r.StaticFS("/videos/", http.Dir("storage/videos/hls/"))

	r.POST("/upload", controllers.UploadOneFile)
	router.Run() // listen and serve on 0.0.0.0:8080
}
