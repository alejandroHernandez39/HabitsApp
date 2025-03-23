var express = require('express');
var router = express.Router();
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/Users");

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post("/register", async(req, res) =>{
  try {
    const { username, password } = req.body;
    
    const salt = await bycript.genSalt(10);
    const hashedPassword = await bycript.hash(password, salt);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.json({ message: "User registered"});

    res.status(201).json({ message: "User registered"});
  }catch(err){
    console.log(err);
    res.status(500).json({ message: "Error registering user"});
  }
}
);

router.post("/login", async(req, res) =>{
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if(!user) throw new Error("User not found");

    const isMatch = await bycript.compare(password, user.password);
    if(!isMatch) throw new Error("Incorrect password");

    const token = jwt.sign({ id: user._id },process.env.JWT_SECRET,{expiresIn: "7d"});

    res.cookie("habitToken",token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7
    })
    res.json({ message: "User logged in", token });
  }catch(err){
    res.status(500).json({ error: "Error logging in","description": err.message});
  }
}
);

module.exports = router;
