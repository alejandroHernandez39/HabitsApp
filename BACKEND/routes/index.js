var express = require('express');
var router = express.Router();
const Habit = require("../models/Habits");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/habits", async(req, res) =>{
  try{
    const habits = await Habit.find();
    res.json(habits);
  }catch(err){
    res.status(500).json({message: "Error retrieving habits"});
  }
});

router.post("/habits", async(req, res) =>{
  try{
    const { title, description } = req.body;
    const habit = new Habit({ title, description });
    await habit.save();
    res.json(habit); 
  }catch(err){
    res.status(400).json({ message: "Error creating habit"});
  }
});

router.delete("/habits/:id", async(req, res) =>{
  try{
    await Habit.findByIdAndDelete(req.params.id);
    res.json({ message: "Habit deleted"});
  }catch(err){
    res.status(500).json({ message: "Habit not found"});
  }
});

router.patch("/habits/markasdone/:id", async(req, res) =>{
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
