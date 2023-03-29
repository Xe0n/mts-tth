package controllers

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/yud-warrior/video-storage-server/db"
)

type StreamResponse struct {
	UnsafePlaylist string `json:"unsafe_playlist"`
	SafePlaylist   string `json:"safe_playlist"`
}

type StreamResponseUnsafe struct {
	UnsafePlaylist string `json:"unsafe_playlist"`
}

type StreamResponseSafe struct {
	SafePlaylist string `json:"safe_playlist"`
}

type StreamResponseEmpty struct {
	Message string `json:"error"`
}

type StreamResponseError struct {
	Error string `json:"error"`
}

// GetStreamPlaylistById godoc
//
//	@Summary		Represents urls for possible .m3u8 playlist for the video
//	@Description	get url by pk (uuid)
//	@Tags			playlists
//	@Accept			json
//	@Produce		json
//	@Param			pk	query		string	true	"VideoItem Id"
//	@Success		200	{object}	StreamResponse
//	@Success		200	{object}	StreamResponseUnsafe
//	@Success		200	{object}	StreamResponseSafe
//	@Success		204	{object}	StreamResponseEmpty
//	@Failure		404	{object}    StreamResponseError
//	@Router			/playlist [get]
func GetStreamPlaylistById(c *gin.Context) {
	database := c.MustGet("dbConn").(db.Database)
	id := c.Query("pk")
	videoItem, err := database.GetVideoItemById(id)
	if err != nil {
		c.JSON(http.StatusNotFound, StreamResponseError{"no video with suh pk"})
		return
	}
	scheme := "http"
	if c.Request.TLS != nil {
		scheme = "https"
	}
	baseUrl := scheme + "://" + c.Request.Host + "/api/v1"
	playlist := "/" + videoItem.ID + ".m3u8"
	unsafeUrl := baseUrl + "/videos"
	safeUrl := baseUrl + "safe/videos"
	unsafe := ""
	safe := ""
	if videoItem.ConvertedToHls {
		unsafe = unsafeUrl + playlist
	}
	if videoItem.SafeConvertedToHls {
		safe = safeUrl + playlist
	}
	if len(unsafe) == 0 && len(safe) == 0 {
		c.JSON(http.StatusNoContent, StreamResponseEmpty{fmt.Sprintf("there are no plalists for this %v", id)})
		return
	}
	if len(safe) == 0 {
		c.JSON(http.StatusOK, StreamResponseUnsafe{unsafe})
		return
	}
	if len(unsafe) == 0 {
		c.JSON(http.StatusOK, StreamResponseSafe{safe})
		return
	}
	c.JSON(http.StatusOK, StreamResponse{unsafe, safe})
}
