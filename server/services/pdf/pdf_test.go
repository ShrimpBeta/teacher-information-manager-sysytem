package pdf

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetPlainTextFormPdf(t *testing.T) {
	// file := "test.pdf"
	file := "test-1.pdf"
	content, err := GetPlainTextFormPdf(file)
	if err != nil {
		t.Fatal(err)
	}
	assert.Equal(t, "Hello World", content)
}
