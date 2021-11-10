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

/*============ROUTES FOR DIARY===========================*/
//read or get all diary entries
app.get('/diaries', async (req, res) => {
  console.log("RES: ", res)
  console.log("REQ: ", req)
  let entry = await Entry.findAll()
  res.json({entry});
  res.status = 200;
})

app.listen(3000, () => {
  console.log("Server running on port 3000");
});