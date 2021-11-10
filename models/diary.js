const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db')

class User extends Model {}
class Diary extends Model {}
User.init({
  name: DataTypes.STRING,
  password: DataTypes.STRING,
}, {
  sequelize,
  timestamps: false,
});

Diary.init({
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    description: DataTypes.STRING,
  //  password:DataTypes.STRING
    
}, {
    sequelize,
    timestamps: false,
});

module.exports = {Diary,User};