package ocr

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGetTextFormImage(t *testing.T) {
	// Read the file
	// file := "test.png"
	file := "test-1.png"

	string, err := GetTextFormImage(file)
	if err != nil {
		t.Fatal(err)
	}
	// Check the data
	assert.Equal(t, "Hello World", string)
}
