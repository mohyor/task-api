const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, unique: true },
  description: { type: String, },
 }, { timestamps: true, }
);

const TaskModel = mongoose.model("Task", taskSchema);

module.exports = { TaskModel, };
