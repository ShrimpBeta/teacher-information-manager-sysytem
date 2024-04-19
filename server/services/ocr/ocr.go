package ocr

import (
	"os/exec"
	"server/environment"
)

func GetTextFormImage(file string) (string, error) {
	ocrCmd := exec.Command(environment.TesseractPath, file, "stdout", "-l", "chi_sim")
	output, err := ocrCmd.Output()
	return string(output), err
}
