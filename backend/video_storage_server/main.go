package main

import (
	"log"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"
	"github.com/yud-warrior/video-storage-server/controllers"
	"github.com/yud-warrior/video-storage-server/db"
	"github.com/yud-warrior/video-storage-server/docs"

	_ "github.com/yud-warrior/video-storage-server/docs"
	//"./docs"
	"github.com/yud-warrior/video-storage-server/middlewares"
)

//	@title			Video Storage Server API
//	@version		1.0
//	@description	This is a service for storing and receiving video.

//	@contact.name	API Support
//	@contact.email	rodionyudenko@gmail.com

//	@license.name	Apache 2.0
//	@license.url	http://www.apache.org/licenses/LICENSE-2.0.html

//	@host		localhost:8080
//	@BasePath	/api/v1

//	@externalDocs.description	OpenAPI
//	@externalDocs.url			https://swagger.io/resources/open-api/

func main() {
	// programmatically set swagger info
	docs.SwaggerInfo.Schemes = []string{"http", "https"}

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
	router.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))
	r := router.Group("/api/v1")
	r.Use(middlewares.CORSMiddleware())
	r.Use(DBMiddleware(database))

	r.StaticFS("/videos/", http.Dir("storage/videos/hls/"))
	r.StaticFS("/safe/videos/", http.Dir("storage/videos/hls/safe"))

	r.POST("/upload", controllers.UploadOneFile)
	r.POST("/safe/upload", controllers.UploadOneSafeFile)

	r.GET("/videolist/all", controllers.GetAllVideoItems)
	r.GET("/videolist/lastn", controllers.GetLastNVideoItems)
	r.GET("/playlist", controllers.GetStreamPlaylistById)

	router.Run() // listen and serve on 0.0.0.0:8080
}

func DBMiddleware(db db.Database) gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Set("dbConn", db)
		c.Next()
	}
}
