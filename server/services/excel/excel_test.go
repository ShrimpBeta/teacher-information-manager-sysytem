package excel

import (
	"os"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestReadFile(t *testing.T) {

	// Read the file
	file, err := os.ReadFile("UGPGGuidance.xlsx")
	if err != nil {
		t.Fatal(err)
	}

	data, err := ConvertToUGPGGuidance(file)
	if err != nil {
		t.Fatal(err)
	}
	// Check the data
	assert.Equal(t, [][]string{{"Hello", "World"}}, data)
}
