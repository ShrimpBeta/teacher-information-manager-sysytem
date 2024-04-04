package email

import (
	"fmt"
	"testing"
)

func TestSendEmail(t *testing.T) {
	code := "123456"
	receiverEmail := "2164516644@qq.com"
	content := fmt.Sprintf("亲爱的 %s 用户，您的验证码是 %s ，有效时间为5分钟（请注意有效期）", receiverEmail, code)
	err := SendEmail(content, receiverEmail)
	if err != nil {
		t.Errorf("SendEmail() error = %v", err)
		return
	}
}
