package restful

import (
	"server/environment"
	"server/middlewares"
	"server/persistence/models"
	"server/services/jwt"
	"server/services/services"

	"github.com/gin-gonic/gin"
)

type Restful struct {
	AccountService *services.AccountService
}

type Admin struct {
	Account  string
	Password string
}

func NewRestful(accountService *services.AccountService) *Restful {
	return &Restful{AccountService: accountService}
}

func (restful *Restful) GetAccounts(c *gin.Context) {

	account, err := middlewares.ForContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Get token Error"})
		return
	}

	if account.Account == environment.AdminAccount {
		users, err := restful.AccountService.GetAccounts()

		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"users": users})
	} else {
		c.JSON(401, gin.H{"error": "Permission denied"})
	}

}

func (restful *Restful) CreateAccount(c *gin.Context) {
	account, err := middlewares.ForContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Get token Error"})
		return
	}

	if account.Account == environment.AdminAccount {
		var user models.RestfulCreateUser
		if err := c.ShouldBindJSON(&user); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}

		Duplicate, err := restful.AccountService.CheckEmailDuplicate(user.Email)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}

		if Duplicate {
			c.JSON(400, gin.H{"error": "Email already exists"})
			return
		}

		newUser, err := restful.AccountService.CreateAccount(user)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Account created", "user": newUser})
	} else {
		c.JSON(401, gin.H{"error": "Permission denied"})
	}
}

func (restful *Restful) DeleteAccount(c *gin.Context) {
	account, err := middlewares.ForContext(c)
	if err != nil {
		c.JSON(401, gin.H{"error": "Get token Error"})
		return
	}

	if account.Account == environment.AdminAccount {
		id := c.Param("id")
		user, err := restful.AccountService.DeleteAccount(id)
		if err != nil {
			c.JSON(500, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"message": "Account deleted", "user": user})
	} else {
		c.JSON(401, gin.H{"error": "Permission denied"})
	}
}

func (restful *Restful) AdminSignIn(c *gin.Context) {
	var admin Admin
	if err := c.ShouldBindJSON(&admin); err != nil {
		c.JSON(400, gin.H{"error": err.Error()})
		return
	}

	if admin.Account == environment.AdminAccount && admin.Password == environment.AdminPassword {
		token, err := jwt.GenerateToken(admin.Account, environment.AdminTokenExpireDuration)
		if err != nil {
			c.JSON(401, gin.H{"error": err.Error()})
			return
		}
		c.JSON(200, gin.H{"token": token})
	} else {
		c.JSON(401, gin.H{"error": "Invalid account or password"})
	}
}
