package pdf

import (
	"bytes"
	"fmt"

	"github.com/ledongthuc/pdf"
)

func GetPlainTextFormPdf(file string) (string, error) {
	f, r, err := pdf.Open(file)
	defer f.Close()
	if err != nil {
		return "", err
	}
	var buf bytes.Buffer
	b, err := r.GetPlainText()
	if err != nil {
		return "", err
	}
	buf.ReadFrom(b)
	return buf.String(), nil
}

func GetRowsTextFormPdf(file string) (string, error) {
	f, r, err := pdf.Open(file)
	defer func() {
		_ = f.Close()
	}()
	if err != nil {
		return "", err
	}
	totalPage := r.NumPage()

	for pageIndex := 1; pageIndex <= totalPage; pageIndex++ {
		page := r.Page(pageIndex)
		if page.V.IsNull() {
			continue
		}
		rows, _ := page.GetTextByRow()
		for _, row := range rows {
			for _, word := range row.Content {
				fmt.Println(word.S)
			}
		}
	}
	return "", nil
}
