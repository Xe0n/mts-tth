package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/yud-warrior/video-storage-server/controllers"
	"github.com/yud-warrior/video-storage-server/db"
	"github.com/yud-warrior/video-storage-server/middlewares"
)

func main() {
	dbUser, dbPassword, dbName :=
		os.Getenv("POSTGRES_USER"),
		os.Getenv("POSTGRES_PASSWORD"),
		os.Getenv("POSTGRES_DB")
	database, err := db.Initialize(dbUser, dbPassword, dbName)
	if err != nil {
		log.Fatalf("Could not set up database: %v", err)
	}
	defer database.Conn.Close()

	router := gin.Default()
	r := router.Group("/api/v1")
	r.Use(middlewares.CORSMiddleware())
	r.StaticFS("/videos/", http.Dir("storage/videos/hls/"))

	r.POST("/upload", controllers.UploadOneFile)

	r.POST("/mkdirtest", controllers.MkDirTest)
	router.Run() // listen and serve on 0.0.0.0:8080
}
