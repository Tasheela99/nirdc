const crypto = require('crypto');

function generateNumericOtp() {
    return crypto.randomInt(100000, 1000000).toString();
}

function generateAlphanumericOtp() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += characters.charAt(crypto.randomInt(0, characters.length));
    }
    return otp;
}

function generateApplicationId(prefix) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let applicationId = '';
    for (let i = 0; i < 12; i++) {
        applicationId += characters.charAt(crypto.randomInt(0, characters.length));
    }
    return `${prefix}-${applicationId}`;
}

module.exports = { generateNumericOtp, generateAlphanumericOtp, generateApplicationId };
