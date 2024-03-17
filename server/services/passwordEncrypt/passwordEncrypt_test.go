package passwordencrypt

import "testing"

func TestEncryptAndDecrypt(t *testing.T) {
	key := "keyforencryptpassword11111111111"
	password := "password"
	encryptedPassword, err := Encrypt(key, password)
	if err != nil {
		t.Errorf("Encrypt error: %v", err)
	}
	decryptedPassword, err := Decrypt(key, encryptedPassword)
	if err != nil {
		t.Errorf("Decrypt error: %v", err)
	}
	if decryptedPassword != password {
		t.Errorf("Decrypt Answer error: %v", decryptedPassword)
	}
}
