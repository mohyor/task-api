const { catchError, mapValidation } = require("../../utils");
const { validateTask } = require("../../validation/task");
const { successResponse, errorResponse } = require("../../utils/response");
const TaskRepository = require("../../repositories/task");
const taskInstance = new TaskRepository();

const rabbitMQ = require("../../../bootstrap/rabbitMQ");

require("dotenv").config();

const createTask = async (req, res) => {
 try {
   let { name, description } = req.body.data;
   
   const validate = await mapValidation(
     { name, description },
     validateTask
   );
   if (validate != null) return errorResponse(res, 422, validate);

   if (await taskInstance.taskExist({ name })) {
     return successResponse(res, 200, "Task already exists");
   }

   const task = await taskInstance.createTask(name, description);

   rabbitMQ.send("Create Task", JSON.stringify(task))
   rabbitMQ.socket.emit("Task Created", task);

   return successResponse(res, 200, "Task Created", task);
 } catch (err) {
   return catchError(err, res);
 }
};

const updateTask = async (req, res) => {
 try {

   const taskID = req.params.taskID;
   
   let data = {};

   let { name, description } = req.body.data;

   const validate = await mapValidation(
     { name, description },
     validateTask
   );
   
   if (validate != null) return errorResponse(res, 422, validate);

   if (!(await taskInstance.taskExist({ _id: taskID }, {}))) {
     return errorResponse(res, 200, "Task doesn't exist");
   }

   if (name) data.name = name;

   if (description) data.description = description;

   await taskInstance.updateTask(req.params.taskID, data);

   return successResponse(res, 200, "Task Updated");
 } catch (err) {
   return catchError(err, res);
 }
};

const getTasks = async (req, res) => {
 try {
   const tasks = await taskInstance.getTasks();

   if (tasks && tasks.length > 0) {
     return successResponse(res, 200, "Task", tasks);
   } else {
     return errorResponse(res, 200, "Tasks not found");
   }
 } catch (err) {
   return catchError(err, res);
 }
};

const getTaskById = async (req, res) => {
 try {
   const task = await taskInstance.getTaskById(req.params.taskID);

   if (await taskInstance.taskExist({ _id: req.params.taskID })) {
     return successResponse(res, 200, "Task", task);
   }
 } catch (err) {
   return catchError(err, res);
 }
};

const deleteTask = async (req, res) => {
 try {
   if (!(await taskInstance.taskExist({ _id: req.params.taskID }, {}))) {
     return errorResponse(res, 200, "Task doesn't exist");
   } else {
     await taskInstance.deleteTask(req.params.taskID);
     return successResponse(res, 200, "Task Deleted!");
   }
 } catch (err) {
   return catchError(err, res);
 }
};

module.exports = {
 createTask,
 updateTask,
 getTasks,
 getTaskById,
 deleteTask,
};
