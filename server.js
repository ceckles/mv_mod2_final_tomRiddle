const express = require("express");
const basicAuth = require('express-basic-auth');
const bcrypt = require('bcrypt');
const {User, Entry} = require('./models');
const seed = require('./seed')

// initialise Express
const app = express();

// specify out request bodies are json
app.use(express.json());
//DB Seed
seed();


//DB Seed
//basic auth needs a config object
app.use(basicAuth({
  authorizer : dbAuthorizer, //custom authorizer fn
  authorizeAsync: true, //allow our authorizer to be async
  unauthorizedResponse : () => 'You are not a Wizard!'
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

/*===========================ROUTES FOR DIARY===========================*/
//read or get all diary entries
app.get('/diaries', async (req, res) => {
  //Get user from auth header
  const userName = req.auth.user;
  console.log(userName)
  //Get User instance from DB
  const usr = await User.findOne({ where: { name: userName } });
  if (usr === null) {
    console.log('Not found!');
    res.json({error: "No User Found"})
    res.status = 404;
  } else {
    console.log("USER instance :", usr instanceof User); // true
    console.log("USER Name: ", usr.name); // 'My Title'
  }
  //Get User Entries from DB
  const entry = await Entry.findAll({where: { UserId: usr.id}})

  //let entry = await Entry.findAll();
  res.json({entry});
  res.status = 200;
})

// Delete Entry 
app.delete('/entry/:id', async(req, res) => {
  await Entry.destroy({where: {id: req.params.id}})
  res.send('Deleted Entery')
})

// Post New Entry 
app.post('entry', async(req, res) => {
  let newEntry = await Entry.create(req.body)
  res.json({newEntry})
})
// Delete User by ID
app.delete('/user/:id', async (req, res) => {
  await User.destroy({where:{id: req.params.id}})
  res.send('Deleted')
})
 app.post('/user', async (req, res) => {
   let newUSer = await User.create(req,body)
   res.json(newUSer)
})

 app.put('/entry/:id', async (req, res) => {
   let updateedEntry = await Entry.update(req.body, {where: {id: req.params.id}})
   res.json({updateedEntry})
 })

//Start server and Listen on Port
let port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server running on port:", port);
});