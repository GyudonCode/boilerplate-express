let express = require('express');
let app = express();

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
    res.json({
    message: "Hello json"
  });
});
































 module.exports = app;
