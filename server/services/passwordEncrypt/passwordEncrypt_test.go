package passwordencrypt

import "testing"

func TestEncryptAndDecrypt(t *testing.T) {
	key := "8c4746a3ef88adb9c2f50c7d9e7eb6010b47d3f6ea0f03991cedfe6509911f50"
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
