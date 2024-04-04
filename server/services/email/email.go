package email

import (
	"log"
	"server/environment"
	"time"

	mail "github.com/xhit/go-simple-mail/v2"
)

func SendEmail(content string, receiverEmail string) error {

	// Create a SMTP client
	emailServer := mail.NewSMTPClient()
	emailServer.Host = environment.EmailHost
	emailServer.Port = environment.EmailPort
	emailServer.Username = environment.EmailUsername
	emailServer.Password = environment.EmailPassword
	// SSL/TLS Email
	emailServer.Encryption = mail.EncryptionSSL
	emailServer.KeepAlive = false
	emailServer.ConnectTimeout = 10 * time.Second
	emailServer.SendTimeout = 10 * time.Second

	// Connect to the SMTP Server
	smtpClient, err := emailServer.Connect()
	if err != nil {
		log.Fatal(err)
		return err
	}

	// Set email data
	email := mail.NewMSG()
	email.SetFrom(environment.EmailUsername).
		AddTo(receiverEmail).
		SetSubject("重置验证码").
		SetBody(mail.TextPlain, content)

	// check error before send
	if email.Error != nil {
		log.Fatal(email.Error)
		return email.Error
	}

	err = email.Send(smtpClient)
	if err != nil {
		log.Fatal(err)
		return err
	} else {
		log.Println("Email sent successfully!")
		return nil
	}
}
