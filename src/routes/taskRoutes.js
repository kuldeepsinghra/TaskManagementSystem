const express = require("express");
const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/taskController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { validateTask } = require("../middlewares/validate");

const router = express.Router();

//create the task first verify the jwt by protect and req.user will give us signature data after decode
router.post("/", protect, validateTask, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, validateTask, updateTask);
//Only Admin Can Delete Any Task
router.delete("/:id", protect, adminOnly, deleteTask);
module.exports = router;
