const bcrypt = require("bcryptjs");
const generator = require("password-generator");

const maxLength = 12;
const minLength = 3;
const lowercaseMinCount = 1;
const numberMinCount = 1;
const specialMinCount = 0;
const LOWERCASE_RE = /([a-z])/g;
const NUMBER_RE = /([\d])/g;
const SPECIAL_CHAR_RE = /([\?\-])/g;

const generateSalt = () => {
    const saltRounds = 10;
    return bcrypt.genSaltSync(saltRounds);
};

const encryptPassword = (salt, password) => {
    return bcrypt.hashSync(password, salt);
};

const generatePassword = () => {
    var password = "";
    var randomLength = Math.floor(Math.random() * (maxLength - minLength)) + minLength;
    while (!isStrongEnough(password)) {
        password = generator(randomLength, true, /[\w\d\?\-]/) + Math.floor(Math.random() * (100 - 999));
    }
    return password;
};
function isStrongEnough(password) {
    const lc = password.match(LOWERCASE_RE);
    const n = password.match(NUMBER_RE);
    const sc = password.match(SPECIAL_CHAR_RE);
    return (
        password.length >= minLength &&
        lc &&
        lc.length >= lowercaseMinCount &&
        n &&
        n.length >= numberMinCount &&
        sc &&
        sc.length >= specialMinCount
    );
}

const isCorrectPassword = async (password, hash) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hash, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

exports.generateSalt = generateSalt;
exports.encryptPassword = encryptPassword;
exports.generatePassword = generatePassword;
exports.isCorrectPassword = isCorrectPassword;
