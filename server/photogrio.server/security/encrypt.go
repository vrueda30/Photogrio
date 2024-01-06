package security

import (
	"account.api/common"
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"io"
	"log"
)

func Decrypt(data []byte, passphrase string) []byte {
	key, _ := hex.DecodeString(passphrase)
	block, err := aes.NewCipher(key)
	common.HandlePanicError(err)
	gcm, err := cipher.NewGCM(block)
	log.Printf("Received gcm: %s", gcm)
	common.HandlePanicError(err)
	nonceSize := gcm.NonceSize()
	nonce, cipherText := data[:nonceSize], data[nonceSize:]
	plaintext, err := gcm.Open(nil, nonce, cipherText, nil)
	if err != nil {
		log.Printf("Recived error while creating plain text: %s", err.Error())
	}
	common.HandlePanicError(err)

	return plaintext
}

func Encrypt(data []byte, passphrase string) []byte {
	log.Printf("Key: %s", passphrase)
	key, _ := hex.DecodeString(passphrase)
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
	log.Printf("cipher text: %x\n", cipherText)
	return cipherText
}
