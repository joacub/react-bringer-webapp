import https from 'https';

const isEmpty = object => {
  for (const prop in object) {
    if (object.hasOwnProperty(prop)) return false;
  }

  return true;
};

const pemEncode = (str, n) => {
  const ret = [];

  for (let i = 1; i <= str.length; i += 1) {
    ret.push(str[i - 1]);
    const mod = i % n;

    if (mod === 0) {
      ret.push('\n');
    }
  }

  const returnString = `-----BEGIN CERTIFICATE-----\n${ret.join('')}\n-----END CERTIFICATE-----`;

  return returnString;
};

const get = url => {
  if (url.length <= 0 || typeof url !== 'string') {
    throw Error('A valid URL is required');
  }

  const options = {
    hostname: url,
    agent: false,
    rejectUnauthorized: false,
    ciphers: 'ALL'
  };

  return new Promise(((resolve, reject) => {
    const req = https.get(options, res => {
      const certificate = res.socket.getPeerCertificate();
      if (isEmpty(certificate) || certificate === null) {
        reject({ message: 'The website did not provide a certificate' });
      } else {
        if (certificate.raw) {
          certificate.pemEncoded = pemEncode(certificate.raw.toString('base64'), 64);
        }
        resolve(certificate);
      }
    });

    req.on('error', e => {
      reject(e);
    });

    req.end();
  }));
};

export default get;
