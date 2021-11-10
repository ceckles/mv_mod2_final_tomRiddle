const path = require('path');
const fs = require('fs').promises;
const {sequelize} = require('./db');
const {Diary}= require('./models/diary.js');

const createDiaries= async () => {

    const diaries = [
        {  title:'Harry Secrets' ,date:'11-4-2021' ,description:'If I could do magic, the handiest thing would be if I could turn out street lamps with a silver cigarette lighter,’ said no one, ever. Oh well, it’s our first glimpse of magic; we’ll take it. And you never know, it might come in handy one day.' },
        {  title: 'Dumbledore Party',date:'08-5-2021' ,description: 'Dumbledore has passed several parties and feasts whilst McGonagall has been sat on a wall. Rub it in, Albus.'},
        {  title:'One darkest secret' ,date:'20-6-2021 ',description:'I wish I could see Dumbledore’s London underground scar/wish I had one myself.'},
        {  title:'Leaky Cauldron' ,date:'11-11-2021' ,description: 'Harry is shaking hands with everyone in the Leaky Cauldron. I wonder if he is going to meet anyone of note or great relevance…'},
    
    ];

    return diaries
}

const seed = async () => {

    await sequelize.sync({ force: true });

    const diaries = await createDiaries();

    try {
        const diaryPromises = diaries.map(diary => Diary.create(diary))
        await Promise.all([...diaryPromises]);
        console.log("db populated!")
    } catch(err){
        
    }
}
seed();