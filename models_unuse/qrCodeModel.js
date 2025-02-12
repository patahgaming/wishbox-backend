const qr = require('qrcode');
const db = require('../config/db');

const generateQrCodeModel = (data) => {
    return new Promise((resolve, reject) => {
        qr.toDataURL(data, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url);
            }
        });
    });
};

module.exports = { generateQrCodeModel };