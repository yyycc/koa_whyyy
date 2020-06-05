const Sequelize = require('sequelize');
const uuid = require('node-uuid');
const mysql = require('./config/mysql');
const moment = require('moment');

function generateId() {
    return uuid.v4();
}

let sequelize = new Sequelize(mysql.database, mysql.username, mysql.password, {
    host: mysql.host,
    dialect: mysql.dialect,
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

const ID_TYPE = Sequelize.BIGINT;

function defineModel(name, attributes) {
    let attrs = {};
    for (let key in attributes) {
        let value = attributes[key];
        if (typeof value === 'object' && value['type']) {
            value.allowNull = value.allowNull || false;
            attrs[key] = value;
        } else {
            attrs[key] = {
                type: value,
                allowNull: false
            };
        }
    }
    attrs.id = {
        type: ID_TYPE,
        primaryKey: true
    };
    attrs.creation_date = {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('creation_date')).format('YYYY-MM-DD HH:mm:ss');
        }
    };
    attrs.last_update_date = {
        type: Sequelize.DATE,
        allowNull: false,
        get() {
            return moment(this.getDataValue('last_update_date')).format('YYYY-MM-DD HH:mm:ss');
        }
    };
    /*attrs.version = {
        type: Sequelize.BIGINT,
        allowNull: false
    };*/
   /* console.log('model defined for table: ' + name + '\n' + JSON.stringify(attrs, function (k, v) {
        if (k === 'type') {
            for (let key in Sequelize) {
                if (key === 'ABSTRACT' || key === 'NUMBER') {
                    continue;
                }
                let dbType = Sequelize[key];
                if (typeof dbType === 'function') {
                    if (v instanceof dbType) {
                        if (v._length) {
                            return `${dbType.key}(${v._length})`;
                        }
                        return dbType.key;
                    }
                    if (v === dbType) {
                        return dbType.key;
                    }
                }
            }
        }
        return v;
    }, '  '));*/
    return sequelize.define(name, attrs, {
        tableName: name,
        timestamps: false,
        hooks: {
            beforeValidate: function (obj) {
                let now = Date.now();
                if (obj.isNewRecord) {
                    console.log('will create entity...' + obj);
                    if (!obj.id) {
                        obj.id = generateId();
                    }
                    obj.creation_date = now;
                    obj.last_update_date = now;
                } else {
                    console.log('will update entity...' + obj);
                    obj.last_update_date = now;
                }
            }
        }
    });
}

const TYPES = ['STRING', 'INTEGER', 'BIGINT', 'TEXT', 'DOUBLE', 'DATE', 'BOOLEAN'];

let exp = {
    defineModel: defineModel,
    sync: () => {
        // only allow create ddl in non-production environment:
        if (process.env.NODE_ENV !== 'production') {
            sequelize.sync({force: true});
        } else {
            throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.');
        }
    }
};

for (let type of TYPES) {
    exp[type] = Sequelize[type];
}

exp.ID = ID_TYPE;
exp.generateId = generateId;

module.exports = exp;
