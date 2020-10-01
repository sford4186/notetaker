// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();

//Port format needed to deploy to Heroku
var PORT = process.env.PORT || 3000;


// Set up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//link express to the public directory to access html and js files
app.use(express.static("public"));

//set array to store all of the notes
var notes = require('./db/db.json')

// Routes
// =============================================================


// Basic route that sends the user first to the AJAX Page
// Retrieve Web page when the Get started button is clicked
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});


//   app.get("/api/notes", function(req, res) {
//     return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
//   });


app.get("/api/notes", function (err, res) {

  // // reads the notes from db.json file
  // notes = fs.readFileSync("Develop/db/db.json", "utf8");
  // // parse it so notes is an array of objects
  // notes = JSON.parse(notes);

  //send objects to the browser
  res.json(notes);
});


// writes the new note to the json file
app.post("/api/notes", function (req, res) {
  if(notes.length){
    req.body.id = notes[notes.length-1].id + 1
  }else{
    req.body.id =1;
  }
  // Set new notes id
  // add the new note to the array of note objects

  //req.body = user input???
  notes.push(req.body);
  // make it string(stringify)so you can write it to the file
  //JSON.stringify(notes)
  // writes the new note to file
console.log(notes)
  fs.writeFile("./db/db.json", JSON.stringify(notes),  function (err) {
    // error handling
    if (err) throw err;
    res.sendStatus(200);
  });
  // changeit back to an array of objects & send it back to the browser(client)
});

// Delete a note???

app.delete("/api/notes/:id", function (req, res) {
  console.log(req.params.id)
  notes = notes.filter(note=>note.id !== parseInt(req.params.id))
  
  fs.writeFile("./db/db.json", JSON.stringify(notes),  function (err) {
    // error handling
    if (err) throw err;
    res.sendStatus(200);
  });
});

//read the file
//find the note with the delete id
// res.send(JSON.parse(notes));
// default to home page
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "Develop/public/index.html"));
});


// Starts the server to begin listening
// =============================================================
app.listen(PORT, function () {
  console.log("App listening on PORT " + PORT);
});
