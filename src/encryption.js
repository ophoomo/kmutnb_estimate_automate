const CryptoJS = require("crypto-js");

const secret = process.env.SECRET_KEY;

const encrypt = (data) => {
  const I = CryptoJS.lib.WordArray.random(16);
  const K = CryptoJS.PBKDF2(secret, I, {
    keySize: 8,
    iterations: 100,
  });

  const O = CryptoJS.lib.WordArray.random(16);
  const U = CryptoJS.AES.encrypt(data, K, {
    iv: O,
    padding: CryptoJS.pad.Pkcs7,
    mode: CryptoJS.mode.CBC,
  });
  return CryptoJS.enc.Base64.stringify(I.concat(O).concat(U.ciphertext));
};

module.exports = { encrypt };
