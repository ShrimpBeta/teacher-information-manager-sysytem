package avatar

import (
	"crypto/md5"
	"encoding/hex"
	"image/color"
	"image/png"
	"log"
	"os"
	"time"

	"github.com/issue9/identicon/v2"
)

func GenerateAvatar(email string) string {
	picture := identicon.Make(identicon.Style1, 128, color.NRGBA{240, 240, 240, 255}, color.NRGBA{85, 98, 211, 255}, []byte(email))
	md5Sum := md5.Sum([]byte(email + time.Now().String()))
	fileName := hex.EncodeToString(md5Sum[:])
	imageFile, err := os.Create("assets/avatar/" + fileName + ".png")
	if err != nil {
		log.Fatal("Failed to create avatar file")
		return ""
	}
	defer imageFile.Close()
	png.Encode(imageFile, picture)
	urlPath := "/static/avatar/" + fileName + ".png"
	return urlPath
}
