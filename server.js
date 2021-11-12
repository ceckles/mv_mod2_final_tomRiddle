const express = require("express");
const basicAuth = require("express-basic-auth");
const bcrypt = require("bcrypt");
const { User, Entry } = require("./models");
const seed = require("./seed");
const { restart } = require("nodemon"); //idk what this is?
// const { json } = require("sequelize/types");

// initialise Express
const app = express();

// Static files 
app.use(express.static('public'))
app.use('/css', express.static(__dirname + 'public/css'))
app.use('/js', express.static(__dirname + 'public/js'))
app.use('/img', express.static(__dirname + 'public/img'))
app.use(express.urlencoded({ extended: false}))

app.set('view-engine', 'ejs')

app.get('', (req, res) => {
  res.render('index.ejs')
}) 

app.get('/login', (req, res) => {
  res.render('login.ejs')
})


app.get('/signup', (req, res) => {
  res.render('signup.ejs')

})



// specify out request bodies are json
app.use(express.json());

//DB Seed comment out to not reseed on restart
seed();

// basic auth needs a config object
app.use(
  basicAuth({
    authorizer: dbAuthorizer, //custom authorizer fn
    authorizeAsync: true, //allow our authorizer to be async
    unauthorizedResponse: (req, res) => "You are not a Wizard!",
  })
);

//compares username + password with what's in the database
// Returns boolean indicating if password matches
async function dbAuthorizer(username, password, callback) {
  try {
    // get user from DB
    const user = await User.findOne({ where: { name: username } });
    // isValid == true if user exists and passwords match, false if no user or passwords don't match
    let isValid =
      user != null ? await bcrypt.compare(password, user.password) : false;
    callback(null, isValid); //callback expects null as first argument
  } catch (err) {
    console.log("OH NO AN ERROR!", err);
    callback(null, false);
  }
}

/*=========================== ROUTES FOR DIARY ENTRY ===========================*/
//read or get all diary entries
app.get("/entry", async (req, res) => {
  //Get user from auth header
  const userName = req.auth.user;
  //Get User instance from DB
  const usr = await User.findOne({ where: { name: userName } });

  //Checking User stuff
  if (usr === null) {
    console.log("Not found!");
    res.json({ error: "No User Found" });
    res.status = 404;
  } else {
    console.log("USER instance :", usr instanceof User); // true
    console.log("USER Name: ", usr.name); // 'My Title'
  }

  //Get User Entries from DB
  const entry = await Entry.findAll({ where: { UserId: usr.id } });

  res.json({ entry });
  res.status = 200;
});

//TODO: Need to add check and db gets
app.get("/entry/:id", async (req, res) => {
   //Get user from auth header
   const userName = req.auth.user;
   //Get User instance from DB
   const usr = await User.findOne({ where: { name: userName } });
  //Get User Entries from DB
  const entry = await Entry.findByPk(req.params.id)
  if(usr.id == entry.id){
    res.json(entry)
    res.status = 200
  }else{
    res.json({Error: "Not an entry you are allow to access"})
    res.status = 403
  }
});

// Delete Entry
app.delete("/entry/:id", async (req, res) => {
  //Check use can delete entry and it belongs to them
  const userName = req.auth.user;
  //Get User instance from DB
  const usr = await User.findOne({ where: { name: userName } });
  //console.log("USER: ", usr.id);
  const entry = await Entry.findByPk(req.params.id);
  //console.log("ENTRY: ", entry.UserId)

  if (entry.UserId == usr.id) {
    await Entry.destroy({ where: { id: req.params.id } });
    res.json({ Delted: entry });
    res.status = 200;
  } else {
    res.json({ Error: "User Not allowed to delete entry" });
    res.status = 401;
  }
});

// Post New Entry
app.post("/entry", async (req, res) => {
  try {
    //get user from auth
    const userName = req.auth.user;
    //Get User instance from DB
    const usr = await User.findOne({ where: { name: userName } });
    //create data for new entry
    let data = { name: req.body.name, body: req.body.body, UserId: usr.id };
    //create new enty in db
    let newEntry = await Entry.create(data);
    //return status 200 entry created
    res.json({ newEntry });
    res.status = 200;
  } catch (err) {
    res.json({ Error: "Unknow server error" });
    res.status = 500;
  }
});

app.put("/entry/:id", async (req, res) => {
  //get user from auth
  const userName = req.auth.user;
  //Get User instance from DB
  const usr = await User.findOne({ where: { name: userName } });
  let entry = await Entry.findByPk(req.body.id);
  if(entry.UserId == usr.id){
    let updatedEntry = await Entry.update(req.body, { where: { id: req.params.id }});
    let newData = await Entry.findByPk(req.body.id); 
    res.json(
      {
        Original_Entry: entry,
        Updated_Entry: newData
      });
    res.status = 200;
  }else{
    res.json({Error: "User not Authorized to perform action"})
    res.status = 401;
  }
});


/*=========================== ROUTES FOR USER ===========================*/
// Delete User by ID
app.delete("/user/:id", async (req, res) => {
  await User.destroy({ where: { id: req.params.id } });
  res.send("Deleted");
});

app.post("/user", async (req, res) => {
  let newUser = await User.create(req, body);
  res.json(newUser);
});


//Start server and Listen on Port
let port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server running on port:", port);
});
