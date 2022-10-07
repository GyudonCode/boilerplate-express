// super quick note for the future about HTTP verbs (!important stuff)
// read -> https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
// (long story short ->) it's basically a CRUD but with verbs
// post is create, read is get, put / patch is update and delete is delete also.


let express = require('express');
let app = express();

//do npm install body-parser or add it to package manually
let bodyParser = require("body-parser");



//------------------ middlewares ---------------------

//This is a middleware, since express resolves
//myApp.js like an script, resolving function after
//function from top to down, we put our middleware at
//top
//ending your middleware calling next(); is mandatory 
//or it will create a "infinite loop"

app.use("/", function(req, res, next) {
  console.log(req.method + " " + req.path + " - " + req.ip)
  next();
});


//This is a chained middleware, after intercepting it it redirects
//to another middleware that has some funcionality
app.get("/now", function(req, res, next) {
  //when visiting domain/now it intercepts the call and add to the 
  //request object a new parameter with the date
  req.time = new Date().toString();
  next();
  //then it chain with another middleware and send a json back 
  //with the time we captured previously
  }, function(req, res) {
    res.json({
      time: req.time
    });
  });


//When using post the data comes as plain text in the request body
//that's not recommended since we're often handling private data
// to encode this data we use bodyParser, it's required on top of this file.
//these two middlewares are decoding and encoding the body
// for some reason those do not require next() as every other
// middleware ::clueless:: but it works flawlesly 
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());





// ------------------NORMAL ROUTES-------------------
app.get("/", function(req, res) {
  /* Sending back a single string isn't cool*/
  /*res.send("Hello Express");*/

  /*Let's send back our index.html*/
  res.sendFile(__dirname + "/public/index.html");
  /*__dirname is a variable that points to you root*/
  /*we just add a route to our public folder*/

//This adds a middleware to server the public folder to user
// it allows you to serve the css file
// Normal usage
//app.use(express.static(__dirname + "/public"));

// Assets at the /public route
app.use("/public", express.static(__dirname + "/public"));  
});


// This serves a json file from a js object using .json function
//It's contained in the /json directory
app.get("/json", function(req, res) {
  if (process.env.MESSAGE_STYLE == "uppercase"){
  res.json({
      message: "Hello json".toUpperCase()
    });
  }else{
    res.json({
      message: "Hello json"
    });
  }
});


//this is an echo server to showcase how we can get info about
//the client, we take a word and send it back, but this could be
//an username to fetch some data in database for example.
// /:word is a variable, it's replaced by whatever the client wants
app.get("/:word/echo", (req, res) => {
  //create an object taking req.params, this is where the :word stored
  const { word } = req.params;
  //send back a json with the data
  res.json({
    echo: word
  });
});


//This is a diferent way to get data from a client. It's called querys
// myDomain/name?first=firstname&last=lastname
// the ? symbol is where the parameters starts
// the & symbol marks where the next parameter is
// in that example route, we have two parameters:
// first with the value firstname and last with lastname
app.get("/name", function(req, res) {
  // req.query is where our parameters are, you access to them by name
  var firstName = req.query.first;
  var lastName = req.query.last;
  // OR you can destructure and rename the keys
  var { first: firstName, last: lastName } = req.query;
  // Use template literals to form a formatted string
  res.json({
    name: `${firstName} ${lastName}`
    //or use basic js syntax
    // name: firstName + " " + lastName
  });
});

//when visiting domain/name?first=John&last=Gyudon
// you will get a response, in a json format -> name: John Gyudon


// you can multiple handlers / routers / middlewares whatever pointing 
//at the same endpoint if they answer to different http verbs
app.post("/name", function(req, res) {
  let { first: firstName, last: lastName } = req.body;
  console.log(firstName + " " + lastName);
    res.json({
    name: firstName + " " + lastName 
  });
});

//when testing this part, be aware that for some reason replit
// do not display json correctly, in the webview you get 
//name: undefined undefined while in console the data looks good
//if you go to the link of your app, instead of using the webview thing
//the json file comes back to the client with the correct data






 module.exports = app;
