package domain

import (
	"log"

	"github.com/estebangarcia21/subprocess"
	//"github.com/yud-warrior/video-storage-server/models"
	//"github.com/yud-warrior/video-storage-server/db"
)

// TODO
func MakeHlsFromSrc(videoItemId string) {
	//videoItem :=
	cmd := subprocess.New("mkdir", subprocess.Arg("testtesttest"))

	if err := cmd.Exec(); err != nil {
		log.Fatal(err)
	}

}
