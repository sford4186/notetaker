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


// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//link express to the public directory
app.use(express.static(path.join(__dirname, "Develop/public")));

//set array to store notes
var notes=[]

// Routes
// =============================================================


// Basic route that sends the user first to the AJAX Page
// Retrieve Web page when the Get started button is clicked
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/notes.html"));
  });
  
  // default to home/index.html page
  app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "Develop/public/index.html"));
  });
  
//   app.get("/api/notes", function(req, res) {
//     return res.sendFile(path.json(__dirname, "Develop/db/db.json"));
//   });
  

app.get("/api/notes", function(err, res) {
    
      // reads the notes from db.json file
      notes = fs.readFileSync("Develop/db/db.json", "utf8");
      // parse it so notes is an array of objects
      notes= JSON.parse(notes);
      
    //send objects to the browser
    res.json(notes);
  });


  // writes the new note to the json file
app.post("/api/notes", function(req, res) {
   
      // reads the json file
      notes = fs.readFileSync("Develop/db/db.json", "utf8");
      console.log(notes);
  
      // parse the data to get an array of objects
      notes = JSON.parse(notes);
      // Set new notes id
      req.body.id = notes.length;
      // add the new note to the array of note objects
      //req.body = user input???
      notes.push(req.body); 
      // make it string(stringify)so you can write it to the file
      notes = JSON.stringify(notes);
      // writes the new note to file
      fs.writeFile("Develop/db/db.json", notes, "utf8", function(err) {
        // error handling
        if (err) throw err;
      });
      // changeit back to an array of objects & send it back to the browser(client)
      res.json(JSON.parse(notes));
    });
  
  // Delete a note???
  
  app.delete("/api/notes/:id", function(req, res) {
      });
  
      // change it back to an array of objects & send it back to the browser (client)
      res.send(JSON.parse(notes));
  
       
  // Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
  