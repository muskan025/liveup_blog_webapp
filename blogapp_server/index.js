const express = require('express');
require('dotenv').config();
const clc = require('cli-color');
const session = require('express-session');
const mongoDbSession = require('connect-mongodb-session')(session);
const fileUpload = require('express-fileupload');
const path = require("path");
const fs = require("fs");
const cors = require('cors');
 
const db = require('./db');
const AuthRouter = require('./Controllers/AuthController');
const BlogRouter = require('./Controllers/BlogController');
const FollowRouter = require('./Controllers/FollowController');
const FileRouter = require('./Controllers/FileController');
const isAuth = require('./Middlewares/isAuth');
const cleanUpBin = require('./cron');

const app = express();
const PORT = process.env.PORT || 8000;
const store = new mongoDbSession({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});
 
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
  origin: 'https://liveup.vercel.app',  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(fileUpload({
  createParentPath: true
}));
app.use(express.static('public'));
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: { 
      httpOnly: true,
     secure: true,
      maxAge: 1000 * 60 * 60 * 24,
      path: "/",
      sameSite: 'None',
  domain: process.env.COOKIE_DOMAIN
    },
  })
);
  
app.use('/auth', AuthRouter);
app.use('/blog', BlogRouter);
app.use('/follow', isAuth, FollowRouter);
app.use("/upload", express.static(path.join(__dirname, 'upload')),FileRouter);   

app.get('/', (req, res) => {
  return res.send('Server is running!');
}); 
 
app.listen(PORT, () => {
  console.log(clc.yellowBright(`https://liveup.vercel.app/`));
  cleanUpBin();
});
