import * as crypto from "crypto";
import * as SecurityConstant from "@/security/SecurityConstant";

class Security {
  constructor() { }


  _encryptDataUsingRsa(data, publicKey, iv) {
    // console.log(publicKey);
    const symmetricKey = this._generateString(32);
    const encryptSymmetricKey = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(symmetricKey),
    );


    const cipher = crypto.createCipheriv('aes-256-cbc', symmetricKey, iv);
    let encryptedData = cipher.update(JSON.stringify(data), 'utf-8', 'base64');
    encryptedData += cipher.final('base64');

    const mac = this._createMac(encryptedData, symmetricKey, iv);

    return {
      secret: encryptSymmetricKey.toString('base64'),
      mac: mac,
      value: encryptedData,
    };
  }
  /// === ENCRYPTION HELPER END ===

  /// === ENCRYPTION/DECRYPTION PUBLIC API START ===
  encryptPublicData(data) {
    try {

      return this._encryptDataUsingRsa(
        data,
        process.env.NEXT_PUBLIC_API_PUBLIC_KEY,
        process.env.NEXT_PUBLIC_API_IV_KEY,
      );
    } catch (e) {
      console.log(e);

    }
  }

  _decryptDataUsingRsa(secret, mac, value, secretKey, iv) {
    try {
      const symmetricKey = crypto
      .privateDecrypt(
        {
          key: secretKey,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(secret, 'base64'),
      )
      .toString();

      const symmetricKeyMac = this._createMac(value, symmetricKey, iv);

      if (symmetricKeyMac != mac) {
        throw Error();
      }

      const decipher = crypto.createDecipheriv('aes-256-cbc', symmetricKey, iv);
      let decryptedData = decipher.update(value, 'base64', 'utf-8');
      decryptedData += decipher.final('utf-8');
      const json = JSON.parse(decryptedData);
      return json;
    } catch (e) {
      console.log(e);
    }
  }

  decryptPublicData(secret, mac, value) {
    try {
      return this._decryptDataUsingRsa(
        secret,
        mac,
        value,
        process.env.NEXT_PUBLIC_API_SECRETE_KEY,
        process.env.NEXT_PUBLIC_API_IV_KEY,
      );
    } catch (e) {
      console.error(e);

    }
  }

  /// === ENCRYPTION/DECRYPTION PUBLIC API END ===

  /// === ENCRYPTION/DECRYPTION USER API START ===
  encryptUserData(data) {
    try {
      // console.log(process.env.NEXT_PUBLIC_API_PUBLIC_KEY, process.env.NEXT_PUBLIC_AUTH_API_IV_KEY);
      // console.log(data);
      return this._encryptDataUsingRsa(data, process.env.NEXT_PUBLIC_API_PUBLIC_KEY, process.env.NEXT_PUBLIC_AUTH_API_IV_KEY);

    } catch (e) {
      console.log(e);

    }
  }

  decryptUserData(secret, mac, value,privateKey) {
    try {
      return this._decryptDataUsingRsa(
        secret,
        mac,
        value,
        privateKey,
        process.env.NEXT_PUBLIC_AUTH_API_IV_KEY,
      );

    } catch (e) {
      console.error(e);
    }
  }

  /// === ENCRYPTION/DECRYPTION USER API END ===

  _createMac(data, key, iv) {
    return crypto
      .createHmac('sha256', key)
      .update(
        Buffer.from(
          Buffer.from(iv).toString('base64') + data,
          'utf-8',
        ).toString(),
      )
      .digest('hex');
  }

  _PKCS7Encoder_decode(text) {
    let pad = text[text.length - 1];
    if (pad < 1 || pad > 16) {
      pad = 0;
    }
    return text.subarray(0, text.length - pad);
  }

  _PKCS7Encoder_encode(text) {
    const blockSize = 16;
    const textLength = text.length;

    const amountToPad = blockSize - (textLength % blockSize);

    const result = Buffer.alloc(amountToPad);
    result.fill(amountToPad);

    return Buffer.concat([text, result]);
  }


  _generateString(length) {
    if (length === 0) {
      throw new Error('Zero-length randomString is useless.');
    }

    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ' +
      'abcdefghijklmnopqrstuvwxyz' +
      '0123456789';
    let objectId = '';
    const bytes = crypto.randomBytes(length);

    for (let i = 0; i < bytes.length; ++i) {
      objectId += chars[bytes.readUInt8(i) % chars.length];
    }

    return objectId;
  }

  _encrypt(text, key) {
    key = key.split('-').join('').trim();
    const encoded = this._PKCS7Encoder_encode(Buffer.from(text));
    const iv = this._generateString(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(false);
    const cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
    return iv + cipheredMsg.toString('base64');
  }

  _decrypt(text, key) {
    const iv = text.toString().substring(0, 16);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    let deciphered = Buffer.concat([
      decipher.update(text.replace(iv.toString(), ''), 'base64'),
      decipher.final(),
    ]);
    deciphered = this._PKCS7Encoder_decode(deciphered);
    return deciphered.toString();
  }

  encryptPayload(data) {
    const encryptedData = this._encrypt(data, process.env.NEXT_PUBLIC_OUTER_KEY_USER);
    const payload = this._encrypt(encryptedData, process.env.NEXT_PUBLIC_OUTER_KEY_PAYLOAD);

    return {
      encryptedData: encryptedData,
      payload: payload,
    };
  }

  decryptPayload(payload) {
    const decryptedPayload = this._decrypt(payload, process.env.NEXT_PUBLIC_OUTER_KEY_PAYLOAD);
    const decryptedData = this._decrypt(decryptedPayload, process.env.NEXT_PUBLIC_OUTER_KEY_USER);

    return {
      decryptedPayload: decryptedPayload,
      decryptedData: decryptedData,
    };
  }
}
export default Security;