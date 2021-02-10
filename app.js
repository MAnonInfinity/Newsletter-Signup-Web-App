// jshint esversion:6

const express = require("express");
const https = require("https");
const request = require("request");
const bodyParser  = require("body-parser");

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));
//The public folder which holds the CSS
app.use(express.static("public"));

app.listen(process.env.PORT || port, function(){
  console.log("Server started at port " + port);
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html")
});

app.post("/", function(req, res){
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us7.api.mailchimp.com/3.0/lists/2554cf5e43"
  const options = {
    method: "POST",
    auth: "manon:547b086098d3962dbbe37753c4b3321e-us7"
  }
  const request = https.request(url, options, function(response){
    console.log(response.statusCode);
    if (response.statusCode === 200){
      res.sendfile(__dirname + "/success.html");
    }
    else {
      res.sendfile(__dirname + "/failure.html")
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    })
  });

  request.write(jsonData);
  request.end();
});


// Handling the button on the failure page
app.post("/failure", function(req, res){
  res.redirect("/");
});

// API Key = 547b086098d3962dbbe37753c4b3321e-us7
// Audience ID = 2554cf5e43
