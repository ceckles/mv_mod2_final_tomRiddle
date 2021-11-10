const path = require('path');
const fs = require('fs').promises;
const {sequelize} = require('./db');
const { User , Entry} = require('./models/index');



const seed = async () => {
    
    await sequelize.sync({ force: true });

    const seedPath = path.join(__dirname, 'TomDiary.json'); // creates path to seed data
    const buffer = await fs.readFile(seedPath); // reads json
    const {users} = JSON.parse(String(buffer)); //parses data
    const {entries} = JSON.parse(String(buffer));
    
    const userPromises = users.map(user => User.create(user));
    const entryPromises = entries.map(entry => Entry.create(entry))
    
    await Promise.all(userPromises, entryPromises)
    console.log("db properly populated!")


    console.log("db populated!");
    
}


module.exports = seed