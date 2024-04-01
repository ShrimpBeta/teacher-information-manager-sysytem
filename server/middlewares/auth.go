package middlewares

import (
	"fmt"
	"net/http"
	"server/services/jwt"
	"strings"

	"github.com/gin-gonic/gin"
)

type AuthData struct {
	Account string
}

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		header := ctx.GetHeader("Authorization")

		// no Authorization,Signup&&SignIn
		if header == "" {
			ctx.Next()
			return
		}

		// validate jwt token
		header_list := strings.Split(header, " ")
		tokenStr := header_list[1]

		account, err := jwt.ParaseToken(tokenStr)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid token"})
			return
		}

		authData := AuthData{
			Account: account,
		}

		// put it in context
		ctx.Set("authData", &authData)
		ctx.Next()
	}
}

func ForContext(ctx *gin.Context) (*AuthData, error) {
	// get user
	raw, exist := ctx.Get("authData")
	if !exist {
		err := fmt.Errorf("could not retrieve user")
		return nil, err
	}
	authData, ok := raw.(*AuthData)
	if !ok {
		err := fmt.Errorf("user has wrong type")
		return nil, err
	}
	return authData, nil
}
