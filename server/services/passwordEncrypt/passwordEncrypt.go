package passwordencrypt

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/hmac"
	cryptoRand "crypto/rand"
	"crypto/sha256"
	"crypto/sha512"
	"encoding/base64"
	"encoding/hex"
	"io"
	"math/rand"
	"strconv"
	"time"
)

// Generate 16 bit Hash Salt，A-Z
func GenerateSalt() string {
	random := rand.New(rand.NewSource(time.Now().UnixNano()))
	bytes := make([]byte, 16)
	for i := range bytes {
		bytes[i] = byte(65 + random.Intn(25))
	}
	return string(bytes)
}

// Hash Sha256 Password with Salt
func HashPassword(password string, salt string) string {
	hasher := sha256.New()
	hasher.Write([]byte(password + salt))
	return hex.EncodeToString(hasher.Sum(nil))
}

// Generate Master Key
func GenerateMasterKey() (string, error) {
	// generate 32 bit random salt
	salt := make([]byte, 32)
	if _, err := io.ReadFull(cryptoRand.Reader, salt); err != nil {
		return "", err
	}

	// get current timestamp
	timestamp := strconv.FormatInt(time.Now().UnixNano(), 10)

	// generate masterkey with sha512
	hasher := sha512.New()
	hasher.Write([]byte(timestamp + hex.EncodeToString(salt)))
	masterKey := hasher.Sum(nil)
	truncatedMasterKey := masterKey[:32]
	return hex.EncodeToString(truncatedMasterKey), nil
}

// Generate Key for Password Encrypt & Decrypt
func GenerateKey(masterKey string, passwordId string) string {
	h := hmac.New(sha256.New, []byte(masterKey))
	h.Write([]byte(passwordId))
	return hex.EncodeToString(h.Sum(nil))
}

// Encrypt Password with AES
func Encrypt(key string, password string) (string, error) {
	keyBytes, err := hex.DecodeString(key)
	if err != nil {
		return "", err
	}
	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", err
	}

	passwordBytes := []byte(password)
	cipherText := make([]byte, aes.BlockSize+len(passwordBytes))
	iv := cipherText[:aes.BlockSize]
	if _, err := io.ReadFull(cryptoRand.Reader, iv); err != nil {
		return "", err
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(cipherText[aes.BlockSize:], passwordBytes)
	return base64.URLEncoding.EncodeToString(cipherText), nil
}

// Decrypt Password with AES
func Decrypt(key string, passwordEncrypted string) (string, error) {
	chiperText, _ := base64.URLEncoding.DecodeString(passwordEncrypted)
	keyBytes, err := hex.DecodeString(key)
	if err != nil {
		return "", err
	}

	block, err := aes.NewCipher(keyBytes)
	if err != nil {
		return "", err
	}

	if len(chiperText) < aes.BlockSize {
		return "", err
	}

	iv := chiperText[:aes.BlockSize]
	chiperText = chiperText[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(chiperText, chiperText)
	return string(chiperText), nil
}
