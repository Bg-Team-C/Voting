import { JSEncrypt } from "jsencrypt";

// Start our encryptor.
let jsEncrypt = new JSEncrypt();

// Generated using https://github.com/travist/jsencrypt
let publicKey = `
-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCJtD2SUH2LkD8weQYuT7bhDUHZ
rzhsIRmacGZMwErS5yP/PRvJ6bZGg4ngtrzWwb/qOziyzvLk1/Qd5lJo/+8NKjbO
bGXlzfKM02g6ZQS5J8P8dG9rdQVuAmjKF0v/73a7mupjFQ3Jy2jFGDyJjkn/AaPI
+MO/8Wo9lyOORdd+bwIDAQAB
-----END PUBLIC KEY-----`;

// Assign our encryptor to utilize the public key.
jsEncrypt.setPublicKey(publicKey);

export const encryptCandidateAddress = address => {
  // Perform our encryption based on our public key - only private key can read it!
  const salt = Date.now();
  const saltedAddress = address + "/" + salt;

  console.log("Address >>>  ", address);
  console.log("Salted Address >>>  ", saltedAddress);
  console.log("encryted Address >>>  ", jsEncrypt.encrypt(saltedAddress));

  return jsEncrypt.encrypt(saltedAddress);
};

export const decryptCandidateAddress = (encryptedSaltedAddress, privateKey) => {
  try {
    // Decrypt with the private key...
    jsEncrypt.setPrivateKey(privateKey);
    const saltedAddress = jsEncrypt.decrypt(encryptedSaltedAddress);

    // remove salt from address
    const address = saltedAddress.split("/")[0];

    console.log("Salted Address >>>  ", saltedAddress);
    console.log("Address >>>  ", address);

    return address;
  } catch (e) {
    alert("Encountered some invalid data but finished.");
  }
  return "0x0000000000000000000000000000000000000000";
};
