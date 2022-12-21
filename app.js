const { PrismaClient } = require('@prisma/client');
const http = require('http');
const fs = require('fs');
const ejs = require('ejs');
const jqeury = require('jquery');
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser'); //requiring all the node modules needed



var app = express(); //Setting app to express for easier calling methods
app.use(bodyparser.urlencoded({extended:true})); //Setting up body-parser
app.use(express.static("images")); //Makes images a public static folder
const prisma = new PrismaClient(); //defines prisma for easier use
const hour = 1000 * 60 * 60; //variable for the time a session can last

const storage = multer.diskStorage({ //Setting up multer so that images can be stored in the images folder
  destination: function(req, file, cb) {
    cb(null, './images');
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
})
var upload = multer({storage: storage});

var session;//declare session

// sets the view engine to ejs
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(session({
  secret: "faeeafefplaceholdersecretoiamwfiomafmeioamofie",
  saveUnitialized:true,
  cookie: { maxAge: hour },
  resave: false
}));

// function mainly for accesebility at the startup of the node console 
async function read() {
  let allUsers = await prisma.account.findMany();
  console.log(allUsers);
}


// Index page that is loaded upon first visit etc 
app.get('/', function(req, res) {
  session = req.session; //sets session to req.session
  if (session.userid){ //checks if a session is ongoing and if it is, you will be sent to the profile page since you´re already logged in
    res.locals.user = req.session.userid;
    res.locals.image = req.session.image; //Sets locals from sessions 
    res.locals.birthday = req.session.birthday;
    res.locals.createdat = req.session.createdat;
    res.render("pages/profile"); 
  }
  else{
  res.render('pages/index'); //renders indexpage in most scenarios
  };
  });

  
  
  // This page displays all users usernames and names in a table 
  app.get('/users', function(req, res) {
    if (session.userid){ //checks if session is in order since this page is only for people that are logged in
    async function readfor() {
      var allUsers = await prisma.account.findMany({ //finds all usernames and names on the database
        select: {
          name: true,
          user: true,
        },
      });
      app.locals.allusers = allUsers; //sets a local for the usernames and names
      res.render('pages/allusers'); //renders the page for all usernames and names
    }
    readfor();
  }
  else {
    res.send('You need to be logged in to perform this action');
  }
  });



  //profile page checks if session is in order and sends you to your profile if it is
  app.get('/proflink', function(req, res){
    if (session.userid){
    res.locals.user = req.session.userid;
    res.locals.image = req.session.image;
    res.locals.birthday = req.session.birthday;
    res.locals.createdat = req.session.createdat;
    res.render('pages/profile');
    }
    else {
      res.send('You need to be logged in to perform this action'); //otherwise you will get a message that tells you that you need to be logged in
    }
  })



  // login page - pretty much the same thing as the above get but the reverse, you can only acess the login page if you are logged out
  app.get('/login', function(req, res) {
    if (session.userid){
      res.locals.user = req.session.userid;
    res.locals.image = req.session.image;
    res.locals.birthday = req.session.birthday;
    res.locals.createdat = req.session.createdat;
    res.render('pages/profile');
    }
    else {
    res.locals.errors = "";
    res.render('pages/login');
    }
  });


  // logout page destroys the session and sends you back to the index page
  app.get('/logout', function(req, res){
    req.session.destroy();
    res.redirect('/');
  });


   // logged in page - no real function to it, just a index/home site for people that are logged in
   app.get('/indexloggedin', function(req, res) {
    if (session.userid){
    res.render('pages/indexloggedin');
    }
    else {
      res.send('You need to be logged in to perform this action');
    }
  });


  // updatepassword page, checks if you are logged in and sends you to the updatepassword page 
  app.get('/updatepassword', function(req, res) {
    if (session.userid){
      res.locals.errors = "";
    res.render('pages/updatepassword');
    }
    else{
      res.send('You need to be logged in to perform this action'); //you'll get this message if you aren't logged in
    }
  });


  // deleteacc page - repetition of the above
  app.get('/deleteacc', function(req, res) {
    if (session.userid){
      res.locals.errors = "";
    res.render('pages/deleteacc');
    }
    else{
      res.send('You need to be logged in to perform this action');
    }
  });


  //Registers a account and sends you to a site that tells you that you succesfully registered
  app.post('/create', upload.single('profpic'), function(req, res) {
    if (req.body.passwd == req.body.rpasswd) //checks if repeated password matches with the first one otherwise a error message is sent
    {
    async function main(){
      const birthtime = new Date(req.body.birthd); //make the date into the proper format for the prisma data
       const passhashed = await bcrypt.hash(req.body.passwd, 10); //hashes and salts password
      const createuser = await prisma.account.create({ //creates a prisma account user from inputs
        data:{

          name: req.body.fname,
          user: req.body.uname,
          password: passhashed,
          image: req.file.filename,
          birthday: birthtime
        },
      })
    }
    main();
    res.render('pages/create'); //renders a page that tells you that the registration was succesfull
  }
  else if(req.body.passwd !== req.body.rpasswd)
  {
    res.send("you failed to repeat the password"); 
  }
});



//Login checks if the password matches the one on the database 
app.post('/profile', function(req, res){
  async function check(){
  const checkifexist = await prisma.account.findUnique({
    where: {
      user: req.body.uname,
    },
  })
  if (checkifexist == null) { //checks if the account exists
    res.locals.errors = "This username does not exist";
    res.render('pages/login');
  }
  else{
  const passwor = checkifexist.password;
  const valid = await bcrypt.compare(req.body.passwd ,passwor); //compares given password with the hashed and salted one on the database
  if(valid == true)
  {
    session = req.session; //sets up session and res.locals with the session data in them
    session.userid = checkifexist.user;
    session.image = checkifexist.image;
    session.birthday = checkifexist.birthday;
    session.createdat = checkifexist.createdAt;
    res.locals.user = req.session.userid;
    res.locals.image = req.session.image;
    res.locals.birthday = req.session.birthday;
    res.locals.createdat = req.session.createdat;
    console.log(req.session);
    
    res.render('pages/profile');  
  }
  else{
    res.locals.errors = "Wrong password";
    res.render('pages/login');
  }
}
}
check();
});



//Updatepassword for the specific user on database 
app.post('/updatepass', function(req, res){
 if (req.session.userid == req.body.uname){ //checks if the sessions user is the same as the given one and gives a error if that isn't the case
  async function ucheck(){
    const checkifexist = await prisma.account.findUnique({
      where: {
        user: req.body.uname,
      },
    });
    const passup = checkifexist.password;
    const valid = await bcrypt.compare(req.body.passwd ,passup); //compares passwords as a safety measure
    if(valid == true)
    {
      const passhashed = await bcrypt.hash(req.body.npasswd, 10);
      const updatepassword = await prisma.account.update(
        {
          where: {
            user: req.body.uname,
          },
          data: {
            password: passhashed, //replaces password with a new one
          },
        })
      res.render('pages/updatepass');
    }
    else{
      res.locals.errors = "Wrong password"; //displays error message
      res.render('pages/updatepassword');
    }
  }
  ucheck();
}
else {
  res.locals.errors = "This is not the account that you are logged in with!"; //error message 
      res.render('pages/updatepassword');
}
});


  //Delete your account by confirming your password 
  app.post('/deleted', function(req, res){
    if (req.session.userid == req.body.uname){ //checks if the session user is the same as the inputted one
    async function dcheck(){
      const checkifexist = await prisma.account.findUnique({
        where: {
          user: req.body.uname,
        },
      })
      const passup = checkifexist.password;
      const valid = await bcrypt.compare(req.body.passwd ,passup);
      if(valid == true) //safety measure
      {
        const deleteUser = await prisma.account.delete( //deletes account
          {
            where: {
              user: req.body.uname,
            },
          })
        req.session.destroy();
        res.render('pages/deleted');
      }
      else{
        res.locals.errors = "Wrong password";
      res.render('pages/deleteacc');
      }
    }
    dcheck();
  }
  else {
    res.locals.errors = "This is not the account that you are logged in with!";
      res.render('pages/deleteacc'); //error messages
  }

    });




read()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
//setup for the nodejs console for easier error handling etc
  app.listen(7040);
  console.log('Server is listening on port 7040');