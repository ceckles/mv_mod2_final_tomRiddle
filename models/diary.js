const {DataTypes, Model} = require('sequelize')
const {sequelize} = require('../db')


class Diary extends Model {}
Diary.init({
    title: DataTypes.STRING,
    date: DataTypes.STRING,
    description: DataTypes.STRING,
  //  password:DataTypes.STRING
    
}, {
    sequelize,
    timestamps: false,
});


module.exports = Diary;