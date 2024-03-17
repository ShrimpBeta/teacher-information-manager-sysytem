package avatar

import (
	"image"
	"image/color"

	"github.com/issue9/identicon/v2"
)

func GenerateAvatar(email string) image.Image {
	return identicon.Make(identicon.Style1, 128, color.NRGBA{240, 240, 240, 255}, color.NRGBA{85, 98, 211, 255}, []byte(email))
}
