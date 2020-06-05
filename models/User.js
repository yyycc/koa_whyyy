const db = require('../db');

// 定义模型y_users，告诉Sequelize如何映射数据库表
let Users = db.defineModel('y_users', {
    name: db.STRING(50),
    gender: {type: db.STRING(10), allowNull: true},
    password: db.STRING(1000),
    role: db.STRING(20),
    mail_address: {type: db.STRING(100), allowNull: true},
    phone_number: {type: db.STRING(20), allowNull: true},
    age: {type: db.INTEGER, allowNull: true},
}, {
    timestamps: false
});

module.exports = Users;
