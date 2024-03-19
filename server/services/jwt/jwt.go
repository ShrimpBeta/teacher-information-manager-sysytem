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

// 24小时有效
const TokenExpireDuration = time.Hour * 24

// 生成Token
func GenerateToken(email string) (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claim := token.Claims.(jwt.MapClaims)
	claim["email"] = email
	claim["exp"] = time.Now().Add(TokenExpireDuration).Unix()
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
		email := claims["email"].(string)
		return email, nil
	} else {
		return "", err
	}
}
