const path = require('path');
const fs = require('fs').promises;
const {sequelize} = require('./db');
const {User,Diary} = require('./models');

const createUsers = async () => {

    let pw1 = await bcrypt.hash('1234', 2);
    let pw2 = await bcrypt.hash('12377', 2);
    let pw3 = await bcrypt.hash('6543', 2);
    let pw4 = await bcrypt.hash('3445', 2);
    let pw5 = await bcrypt.hash('31344', 2);

    const users = [
        {name : 'Tom', password: pw1 },
        {name : 'Afreen', password: pw2 },
        {name : 'Ashley', password : pw3},
        {name : 'Chad', password: pw4},
        {name : 'Sharon', password: pw5 },
    ];

    return users
}

    const diaries = [
        {  title:'Harry Secrets' ,date:'11-4-2021' ,description:'If I could do magic, the handiest thing would be if I could turn out street lamps with a silver cigarette lighter,’ said no one, ever. Oh well, it’s our first glimpse of magic; we’ll take it. And you never know, it might come in handy one day.' },
        {  title: 'Dumbledore Party',date:'08-5-2021' ,description: 'Dumbledore has passed several parties and feasts whilst McGonagall has been sat on a wall. Rub it in, Albus.'},
        {  title:'One darkest secret' ,date:'20-6-2021 ',description:'I wish I could see Dumbledore’s London underground scar/wish I had one myself.'},
        {  title:'Leaky Cauldron' ,date:'11-11-2021' ,description: 'Harry is shaking hands with everyone in the Leaky Cauldron. I wonder if he is going to meet anyone of note or great relevance…'},
    
    ];


const seed = async () => {

    await sequelize.sync({ force: true });
    const users = await createUsers(); // create users w/ encrypted passwords


    try {
        const userPromises = users.map(user => User.create(user))
        const diaryPromises = diaries.map(diary => Diary.create(diary))
        await Promise.all([...diaryPromises,...userPromises]);
        console.log("db populated!")
    } catch(err){
        
    }
}
seed();