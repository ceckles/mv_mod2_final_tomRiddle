const express = require('express');
const path = require('path');
const basicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt');
const {User,Diary} = require('./models/diary');
// initialise Express
const app = express();

// specify out request bodies are json
app.use(express.json());

/*========Basic OAuth================*/
//basic auth needs a config object
app.use(basicAuth({
  authorizer : dbAuthorizer, //custom authorizer fn
  authorizeAsync: true, //allow our authorizer to be async
  unauthorizedResponse : () => 'None shall pass!'
}))

//compares username + password with what's in the database
// Returns boolean indicating if password matches
async function dbAuthorizer(username, password, callback){
  try {
    // get user from DB
    const user = await User.findOne({where : {name : username}})
    // isValid == true if user exists and passwords match, false if no user or passwords don't match
    let isValid = (user != null) ? await bcrypt.compare(password, user.password) : false;
    callback(null, isValid); //callback expects null as first argument
  } catch(err) {
    console.log("OH NO AN ERROR!", err)
    callback(null, false);
  }
}

/*============ROUTES FOR USER===========================*/
app.get('/', (req, res) => {
  res.send('<h1>Tom Riddle Diary!!!!</h1>')
})

//get all users
app.get('/users', async (req, res) => {
  //what should i put here?
  let users = await User.findAll()
  res.json({users});
})

//get one user
app.get('/users/:id', async (req, res) => {
  let user = await User.findByPk(req.params.id);
  res.json({user});
})

/*============ROUTES FOR DIARY===========================*/
//read or get all diary entries
app.get('/diaries', async (req, res) => {
  let diaries = await Diary.findAll()
  res.json({diaries});
})

//read one diary entry
app.get('/diaries/:id', async (req, res) => {
  let diary = await Diary.findByPk(req.params.id);
  res.json({diary});
})

//create one diary entry

app.post('/diaries', async(req, res)=> {
  let newDiaryEntry = await Diary.create(req.body);
  res.json({newDiaryEntry})
})

// update one diary entry

app.put('/diaries/:id', async(req, res)=> {
  let updatedDiary = await Diary.update(req.body, {
    where : {id : req.params.id}
  });
  res.json({updatedDiary})
})

 //delete one diary entry 

app.delete('/diaries/:id', async(req, res)=> {
  await Diary.destroy({where: {id: req.params.id}});
  res.send('Diary Entry Deleted!')
})

app.listen(8000, () => {
  console.log("Server running on port 8000");
});
