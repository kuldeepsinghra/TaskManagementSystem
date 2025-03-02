const Task = require("../models/Task");
const { sendTaskNotification } = require("../utils/email");
const User = require("../models/User");
const logger = require("../utils/logger"); // Logging utility


//Create Task Api
exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, assignedTo } = req.body;
    //validation for required parameters already done into the validateTask from middleware
    //use create hook to create a data of task
    const task = await Task.create({
      title,
      description,
      dueDate,
      createdBy: req.user.id,//coming from protect which is use into route to verify that this user is calling our api
      assignedTo: assignedTo || req.user.id,
    });

    logger.info(`Task Created: ${title} by ${req.user.id}`);

    // Send notification via email and validation that this task not assign to the self user
    if (assignedTo && assignedTo !== req.user.id) {
      const assignedUser = await User.findById(assignedTo);
      if (assignedUser) await sendTaskNotification(assignedUser.email, task);
    }

    res.status(201).json({
      message:"Task Created Successfully",
      status: "success",
      createdTaskDetail:task
    });

  } catch (error) {
    logger.error(`Task Creation Failed: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Tasks (Admin) / User’s Own Tasks Using of pagination
exports.getTasks = async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      //find the task which is created by this user means jwttoken users task we can also give an id, going through middleware the token will be decoded
      const tasks = await Task.find({ createdBy: req.user.id })
        .limit(limit * 1)
        .skip((page - 1) * limit)//skip the previous page so that correct pages will come after
        .exec(); // execute the query
      res.json({
        message:"This is your tasks",
        status: "success",
        tasks: tasks
      }); // return the task
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  };

// Update Task (Only Owner or Admin)
exports.updateTask = async (req, res) => {
    try {
      //find task by detail by id (task id)
      const task = await Task.findById(req.params.id);
      if (!task) return res.status(404).json({ message: "Task not found" });
      //only admin can update the task easily if not an admin then it should be created by same user for update the task
      if (req.user.role !== "admin" && task.createdBy.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized" });
      }
     // replace the value of task or overwrite with new one
      Object.assign(task, req.body);
      await task.save(); // save the new update task
      //log create in logs or activity logs file
      logger.info(`Task Updated: ${task.title} by ${req.user.id}`);
        res.json({
        message:"your task updated successfully",
        status: "success",
        tasks: tasks //new updated task as a response
      });  
    } catch (error) {
      logger.error(`Task Update Failed: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  };

// Delete Task + Log Action
exports.deleteTask = async (req, res) => {
    try {
      //find the task by id into tasks collection of mongodb via task id 
      const task = await Task.findById(req.params.id);
      //return failure msg as task not found error
      if (!task) return res.status(404).json({ message: "Task not found" });
      // if (req.user.role !== "admin" && task.createdBy.toString() !== req.user.id) {
      //   return res.status(403).json({ message: "Unauthorized" });
      // }
      await task.deleteOne();
      logger.info(`Task Deleted: ${task.title} by ${req.user.id}`);
  
      res.json({
         message: "Task deleted by admin successfully",
         status: "success"
       });
    } catch (error) {
      logger.error(`Task Deletion Failed: ${error.message}`);
      res.status(500).json({ message: "Server error" });
    }
  };
  
