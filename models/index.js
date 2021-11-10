const {Sequelize, DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db')


class User extends Model {}

class Entry extends Model {}

User.init({
    name: DataTypes.STRING,
    password: DataTypes.STRING,
}, {
    sequelize,
    timestamps: false,
});


Entry.init({
    name: DataTypes.STRING,
    body: DataTypes.STRING
}, {
    sequelize,
    timestamps: false,
});

User.hasMany(Entry);
Entry.belongsTo(User);

module.exports = {User, Entry};