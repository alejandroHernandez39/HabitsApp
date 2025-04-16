var express = require('express');
var router = express.Router();
const Habit = require("../models/Habits");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const autenticateToken = (req, res, next) =>{
  const token = req.header("Authorization");
  if(!token) {
    return res.status(401).json({ error: "No token provided"});
  }

  try{
    const tokenWithoutBearer = token.replace("Bearer ", "");
    console.log(token);
    const verified = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
    req.user = verified;
    next();
  }catch(err){
    console.error(err);
    res.status(403).json({ error: "Invalid token"});
  }
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/habits", autenticateToken ,async(req, res) =>{
  try{
    if (!req.user || !req.user.id) {
      return res.status(500).json({ message: "Error retrieving habits" });
    }
    let userId = req.user.id;

    const habits = await Habit.find({ "userId": new mongoose.Types.ObjectId(userId) });

    res.json(habits);
  }catch(err){
    res.status(500).json({message: "Error retrieving habits  aaaa"});
  }
});

router.post("/habits", autenticateToken, async(req, res) =>{
  try{
    const { title, description } = req.body;
    if (!req.user || !req.user.id) {
      return res.status(500).json({ message: "Error adding habit"}); 
    }
    let userId = req.user.id;
    userId = new mongoose.Types.ObjectId(userId);
    const habit = new Habit({ title, description, userId });
    await habit.save();
    res.json(habit); 
  }catch(err){
    res.status(400).json({ message: "Error creating habit"});
  }
});

router.delete("/habits/:id", autenticateToken, async(req, res) =>{
  try{
    if (!req.user || !req.user.id) {
      return res.status(500).json({ message: "Error deleting habit"}); 
    }
    let userId = req.user.id;

    const habit = await Habit.findById(req.params.id);

    if (habit.userId.toString() !== userId) {
      return res.status(403).json({ message: "Unauthorized"});
    }

    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted"});
  }catch(err){
    res.status(500).json({ message: "Habit not found"});
  }
});

router.patch("/habits/markasdone/:id", autenticateToken, async(req, res) =>{
  try{
    const habit = await Habit.findById(req.params.id);
    habit.lastDone = new Date();

    if(timeDifferenceInHours(habit.lastDone, habit.lastUpdated) < 24){
      habit.days = timeDifferenceInDays(habit.lastDone, habit.startedAt);
      habit.lastUpdated = new Date();
      habit.save();
      res.json({ message: "Habit marked as done"});                              
    } else {
      habit.days = 1;
      habit.lastUpdated = new Date();
      habit.save();
      res.json({ message: "Habit restarted"}); 
    }
  }catch(err){
    res.status(500).json({ message: "Error updating habit"});
  }
});

router.put("/habits/markasdone:id", async(req, res) =>{
  try{
    const { title, description } = req.body;
    await
    Habit.findByIdAndUpdate(req.params.id, { title, description });
    res.json({ message: "Habit updated"});
  }catch(err){
    res.status(500).json({ message: "Error updating habit"});
  }
});

const timeDifferenceInHours = (date1, date2) => {
  const diff = Math.abs(date1 - date2);
  return diff / (1000 * 60 * 60);
};

const timeDifferenceInDays = (date1, date2) => {
  const diff = Math.abs(date1 - date2);
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};


module.exports = router;
