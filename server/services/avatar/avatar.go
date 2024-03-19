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
	md5Sum := md5.Sum([]byte(email + time.Now().String()))
	picture := identicon.Make(identicon.Style1, 512, color.NRGBA{240, 240, 240, 255}, color.NRGBA{85, 98, 211, 255}, md5Sum[:])
	fileName := hex.EncodeToString(md5Sum[:])
	imageFile, err := os.Create("assets/avatars/" + fileName + ".png")
	if err != nil {
		log.Fatal("Failed to create avatar file")
		return ""
	}
	defer imageFile.Close()
	png.Encode(imageFile, picture)
	urlPath := "/avatars/" + fileName + ".png"
	return urlPath
}
