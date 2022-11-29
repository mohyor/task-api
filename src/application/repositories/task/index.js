const mongoose = require("mongoose");
const { TaskModel } = require('../../models/task');
const Database = require('../database');

class TaskRepository {
 #model;

 constructor() {
  this.#model = TaskModel;
 }

  async taskExist(andFilter = {}, orFilter = {}) {
    try {
      const dbInstance = new Database(this.#model);

      let query = {};

      if (Object.keys(andFilter).length) {
        query["$and"] = await dbInstance.buildClause(andFilter);
      }

      if (Object.keys(orFilter).length) {
        query["$or"] = await dbInstance.buildClause(orFilter);
      }

      return await dbInstance.exist(query);
    } catch (err) {
      throw new Error(err);
    }
  }

  async createTask(name, description) {
    try {
      let obj = { name, description };
      obj["_id"] = new mongoose.Types.ObjectId();

      return await this.#model.create(obj);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getTasks() {
    try {
      return await this.#model.find().exec();
    } catch (err) {
      throw new Error(err);
    }
  }

  async getTaskById(taskID) {
    try {
      return await this.#model.findById(taskID);
    } catch (err) {
      throw new Error(err);
    }
  }

  async getTask(filter = {}) {
    try {
      return await this.#model.findOne(filter).exec();
    } catch (err) {
      throw new Error(err);
    }
  }

  async updateTask(taskID, data = {}) {
    try {
      return await this.#model.findById(taskID).updateOne(data);
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteTask(taskID) {
    try {
      return await this.#model.findByIdAndDelete(taskID).exec();
    } catch (err) {
      throw new Error(err);
    }
  }

}

module.exports = TaskRepository;