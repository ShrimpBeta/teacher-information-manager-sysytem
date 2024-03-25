package avatar

import (
	"bytes"
	"crypto/md5"
	"encoding/hex"
	"image/color"
	"image/png"
	"log"
	"os"
	"time"

	"github.com/issue9/identicon/v2"
)

func GenerateAvatar(email string) (string, error) {
	md5Sum := md5.Sum([]byte(email + time.Now().String()))
	picture := identicon.Make(identicon.Style1, 512, color.NRGBA{240, 240, 240, 255}, color.NRGBA{85, 98, 211, 255}, md5Sum[:])

	// Convert picture to []byte
	buf := new(bytes.Buffer)
	err := png.Encode(buf, picture)
	if err != nil {
		log.Fatal("Failed to encode picture")
		return "", err
	}

	return SaveAvatar(buf.Bytes())
}

func SaveAvatar(file []byte) (string, error) {
	md5Sum := md5.Sum(file)
	fileName := hex.EncodeToString(md5Sum[:])
	imageFile, err := os.Create("assets/avatars/" + fileName + ".png")
	if err != nil {
		log.Fatal("Failed to create avatar file")
		return "", err
	}
	defer imageFile.Close()
	imageFile.Write(file)
	urlPath := fileName + ".png"
	return urlPath, nil
}

func DeleteAvatar(avatar string) {
	err := os.Remove("assets" + avatar)
	if err != nil {
		log.Fatal("Failed to delete avatar file")
	}
}
