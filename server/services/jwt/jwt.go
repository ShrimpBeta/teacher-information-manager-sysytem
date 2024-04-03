package jwt

import (
	"log"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

// secret key being used to sign tokens
var (
	SecretKey = []byte("secret")
)

// 生成Token
func GenerateToken(account string, tokenExpireDuration time.Duration) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claim := token.Claims.(jwt.MapClaims)
	claim["account"] = account
	claim["exp"] = time.Now().Add(tokenExpireDuration).Unix()
	tokenString, err := token.SignedString(SecretKey)
	if err != nil {
		log.Fatal("Error in Generating key")
		return "", err
	}
	return tokenString, nil
}

// 解析Token
func ParaseToken(tokenStr string) (string, error) {
	token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
		return SecretKey, nil
	})
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		account := claims["account"].(string)
		return account, nil
	} else {
		return "", err
	}
}
