package middlewares

import (
	"fmt"
	"net/http"
	"server/persistence/models"
	"server/persistence/repository"
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

		user := models.User{Email: email}
		id, err := repository.Repos.UserRepo.GetUserIdByEmail(email)

		// create user and check if user exists in db
		if err != nil {
			ctx.Next()
			return
		}
		user.ID = *id

		// put it in context
		ctx.Set("user", &user)
		ctx.Next()
	}
}

func ForContext(ctx *gin.Context) (*models.User, error) {
	// get user
	raw, exist := ctx.Get("user")
	if !exist {
		err := fmt.Errorf("could not retrieve user")
		return nil, err
	}
	user, ok := raw.(*models.User)
	if !ok {
		err := fmt.Errorf("user has wrong type")
		return nil, err
	}
	return user, nil
}
