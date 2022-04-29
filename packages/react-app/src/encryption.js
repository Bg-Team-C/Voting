import { Buffer } from 'buffer';
const {
  randomBytes,
  createDecipheriv,
  createCipheriv,
  createHash
} = require('crypto');


const algorithm = 'aes256';
const password = 'Password used to generate key';
const iv = Buffer.alloc(16, 0);
const ivInput = createHash('sha256').update('myHashedIV').digest();
iv.copy(ivInput);
const key = createHash('sha256').update(password).digest();//scrypt(password, 'salt', 32);





export function encrypt(data) {
    data = randomBytes(2).toString('hex') + data + randomBytes(1).toString('hex');
    let  cipher = createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(data, 'binary', 'hex')
    encrypted += cipher.final('hex');
    console.log("encrpted value " + encrypted);
    return encrypted.toString();
}

export function decrypt(data) {
    let decipher = createDecipheriv(algorithm, key, iv);
    let decrypted = [];
    decrypted.push(decipher.update(data, 'hex', 'binary'))
    decrypted.push(decipher.final('binary'));
    console.log(decrypted)
    decrypted = decrypted.join('').slice(4, -2);
    console.log(decrypted);
    return decrypted;
}
