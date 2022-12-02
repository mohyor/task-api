const amqp = require('amqplib');
require("dotenv").config();
const Database = require('../bootstrap/database');
const { TaskModel } = require('../application/models/task');
const TaskRepository = require("../application/repositories/task");
const taskInstance = new TaskRepository();
const mongoose = require("mongoose");

/*
  const amqp = require("amqplib");
  const server = require('../app').server;
*/

const app = require('express')();
const server = require('http').Server(app);

const { Server } = require("socket.io");
const io = new Server(server);

const socket = io.on('connection', (socket) => {
 console.log('Connected');
 socket.on("Disconnected", () => console.log(`${socket.id} User disconnected.`));
});

class rabbitMQ {

  #model;
  #amqpServerURL;
  #connection;
  #channel;
  #dbName

  constructor(connection, channel) {
    this.#model = TaskModel;
    this.#amqpServerURL = process.env.amqpServerURL + "?heartbeat=60";
    //this.#amqpServerURL = process.env.AMQP_URL + "?heartbeat=60";
    this.#connection = connection;
    this.#channel = channel;
    this.#dbName = "tasks";
  }

  async #connectToQueue(key) {
    try {
      this.#connection = await amqp.connect(this.#amqpServerURL);

      this.#channel = await this.#connection.createChannel();

      await this.#channel.assertQueue(key);
   
    } catch (e) {
      console.log("RabbitMQ Failed to connect, error: " + e);
      process.exit();
    }
  }

  async #produceData(data) {
    try {
      await this.#channel.sendToQueue(this.#dbName, Buffer.from(JSON.stringify(data)));
      console.log(data);
    
    } catch (err) {
      console.log("Failed to send data to queue, error: " + err);
    }
  }


  async produce(data) {
    try {
      await this.#connectToQueue(this.#dbName);

      console.log("Sending data to queue.");
      await this.#produceData(data);

    } catch (err) {
      console.log(err);
    }
  }

  async consume(data) {
    try {
      await this.#connectToQueue(this.#dbName);
      console.log("Listening for data");
      
      await this.#channel.consume(this.#dbName, JSON.stringify(data));
      console.log(data);
      console.log("Data consumed.");

      /*
        //async (message) => {
        
        //let parseData = JSON.parse(data.content);
        //const task = await #this.createTask(name, description)
        //await this.#consumeData(Buffer.from(JSON.parse(data)));
        //JSON.parse(data);
        
        //this.#channel.ack(data);
         //console.log(data.content);
      */

    } catch (e) {
      console.log("Failed to consume, error: " + e);
      process.exit();
    }
  }
}

module.exports = rabbitMQ;



