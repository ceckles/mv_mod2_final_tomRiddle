const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./routes/index');
const { auth } = require('express-openid-connect');
const Diary = require('./models/diary.js');

dotenv.load();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

const config = {
  authRequired: false,
  auth0Logout: true
};

const port = process.env.PORT || 3000;
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
  config.baseURL = `http://localhost:${port}`;
}

//Paths
app.use(auth(config));
app.use('/', router);


// Middleware to make the `user` object available for all views
app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

//profle path
const { requiresAuth } = require('express-openid-connect');
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handlers
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: process.env.NODE_ENV !== 'production' ? err : {}
  });
});

/*============ROUTES ===========================*/
app.get('/', (req, res) => {
  res.send('<h1>Tom Riddle Diary!!!!</h1>')
})

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

//Start server and listen to port
http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
