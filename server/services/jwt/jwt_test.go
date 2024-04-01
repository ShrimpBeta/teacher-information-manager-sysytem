package jwt

import (
	"testing"
)

func TestGenerateToken(t *testing.T) {
	email := "email@example.com"
	_, err := GenerateToken(email)
	if err != nil {
		t.Errorf("GenerateToken error: %v", err)
	}

}

func TestParaseToken(t *testing.T) {
	// tokenStr := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiZW1haWxAZXhhbXBsZS5jb20iLCJleHAiOjE3MTE2MTkyODl9.1uORE32cNahS0uGF_VBWcfUnd__je0eRYquSY910Aac"
	tokenStr := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50IjoiZW1haWxAZXhhbXBsZS5jb20iLCJleHAiOjE5MDEwMzA0Mzd9.8p56czTiRjaRWYi-mcFq5wUUFrT0aOIiZibeKvvL3x0"
	_, err := ParaseToken(tokenStr)
	if err != nil {
		t.Errorf("ParaseToken error: %v", err)
	}

}
