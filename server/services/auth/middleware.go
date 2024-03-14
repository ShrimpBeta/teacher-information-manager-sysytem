package auth

import (
	"net/http"
	"server/models"
	"server/services/jwt"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		header := ctx.GetHeader("Authorization")

		// no Authorization,Signup&&SignIn
		if header == "" {
			ctx.Next()
			return
		}

		// validate jwt token
		tokenStr := header
		email, err := jwt.ParaseToken(tokenStr)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Invalid token"})
			return
		}

		user := models.User{Username: email}
		id, err := user.GetUserIdByEmail(email)

		// create user and check if user exists in db
		if err != nil {
			ctx.Next()
			return
		}
		user.ID = id

		// put it in context
		ctx.Set("user", &user)
		ctx.Next()
	}
}

func ForContext(ctx *gin.Context) models.User {
	// get user
	raw, exist := ctx.Get("user")
	if !exist {
		return models.User{}
	}
	user, _ := raw.(*models.User)
	return *user
}
