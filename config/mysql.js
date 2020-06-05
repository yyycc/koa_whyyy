// mysql files:
const defaultMysql = './mysql-default.js';
const overrideMysql = './mysql-override.js';
const testMysql = './mysql-test.js';

const fs = require('fs');

var mysql = null;

if (process.env.NODE_ENV === 'test') {
    mysql = require(testMysql);
} else {
    mysql = require(defaultMysql);
    try {
        if (fs.statSync(overrideMysql).isFile()) {
            mysql = Object.assign(mysql, require(overrideMysql));
        }
    } catch (err) {
        console.log(`Cannot load ${overrideMysql}.`);
    }
}

module.exports = mysql;
