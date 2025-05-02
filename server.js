//import necessary modules
const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const session = require("express-session");

//initiate express app
const app = express();
const PORT = 3000;
const USERS_FILE = "./users.json";//the file where all the users are saved

//middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("frontend"));

//configuration of the session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

//check if the users.json exist and if the answer is yes , it reads it and return the users file
function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) return [];
  return JSON.parse(fs.readFileSync(USERS_FILE));
}

//it writes the users in users.json
function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

//registration
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const users = loadUsers();

  //if the email is already used you will get an error
  if (users.find(u => u.email === email)) {
    return res.status(400).send("The adrress email is already used!");
  }

  //if everything goes alright the user is saved in users.json and redirect to login page
  users.push({ username, email, password });
  saveUsers(users);
  res.redirect("/login.html");
});

//login
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find(u => u.email === email && u.password === password);


  //if the email or the password are wrong you will get an error
  if (!user) {
    return res.status(401).send("The email address or the passwors are invalid");
  }

  //save the user that is in this session
  req.session.user = user;

  //after loggin we redirect the user to the main page where he can do all the actions
  res.redirect("/main.html");
});

//Main Page
app.get("/main", (req, res) => {
    if (!req.session.user) {
      return res.redirect("/login.html");  //if the user is not logged redirect to login
    }
  
    const username = req.session.user.username; //save the username
    
    // send the username
    res.sendFile(__dirname + '/frontend/main.html'); // send it to main
  });
  

 //the route to get the username
app.get("/get-user", (req, res) => {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not logged in" });
    }
  
    res.json({ username: req.session.user.username });
  });
  

// Logout
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Can't close the session");
    }
    res.redirect("/login.html");
  });
});

//we start the server
app.listen(PORT, () => {
  console.log(`Server ruleaza pe http://localhost:${PORT}`);
});
