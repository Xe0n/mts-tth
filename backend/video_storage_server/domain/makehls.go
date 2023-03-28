package domain

import (
	"log"
	"strings"

	"github.com/estebangarcia21/subprocess"
	"github.com/yud-warrior/video-storage-server/db"
	"github.com/yud-warrior/video-storage-server/models"
)

func MakeHlsFromSrc(db db.Database, videoItem models.VideoItem) {
	if videoItem.ConvertedToHls {
		return
	}

	nameParts := strings.Split(videoItem.Name, ".")
	fileFormat := nameParts[len(nameParts)-1]

	videoStoragePath := "storage/videos/"
	if videoItem.SafeVersion {
		videoStoragePath += "safe/"
	}
	srcPath := videoStoragePath + "src_videos/" + videoItem.Name
	hlsPath := videoStoragePath + "hls/" + videoItem.ID

	if fileFormat == ".mp4" {
		cmd := subprocess.New("./mp4_to_hls_ffmpeg.sh", subprocess.Args(srcPath, hlsPath))

		if err := cmd.Exec(); err != nil {
			log.Fatal(err)
		}

		_, err := db.UpdateVideoItemConvertedToHls(videoItem.ID, true)

		if err != nil {
			log.Fatal(err)
		}
	}

}
