package security

import (
	"contacts.api/common"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"io"
)

func Decrypt(data []byte, passphrase string) []byte {
	key := []byte(passphrase)
	block, err := aes.NewCipher(key)
	common.HandlePanicError(err)
	gcm, err := cipher.NewGCM(block)
	common.HandlePanicError(err)
	nonceSize := gcm.NonceSize()
	nonce, cipherText := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, cipherText, nil)
	common.HandlePanicError(err)

	return plaintext
}

func Encrypt(data []byte, passphrase string) []byte {
	key := []byte(passphrase)
	block, err := aes.NewCipher(key)
	common.HandlePanicError(err)
	gcm, err := cipher.NewGCM(block)
	common.HandlePanicError(err)
	nonceSize := gcm.NonceSize()
	nonce := make([]byte, nonceSize)
	if _, err := io.ReadFull(rand.Reader, nonce); err != nil {
		common.HandlePanicError(err)
	}

	cipherText := gcm.Seal(nonce, nonce, data, nil)
	return cipherText
}
