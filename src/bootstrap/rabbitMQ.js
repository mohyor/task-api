const amqp = require('amqplib');
require("dotenv").config();
const { MongoClient } = require("mongodb");

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

  #dbURI;
  #amqpServerURL;
  #connection;
  #channel;
  #dbName

  constructor(dbURI, connection, channel) {
    this.#dbURI = dbURI;
    this.#amqpServerURL = process.env.amqpServerURL + "?heartbeat=60";
    //this.#amqpServerURL = process.env.AMQP_URL + "?heartbeat=60";
    this.#connection = connection;
    this.#channel = channel;
    this.#dbName = "tasks";
  }

  async #dbConnect() {
    try {
      const client = new MongoClient(this.#dbURI);
      await client.connect();

      let database = client.db(this.#dbName);

      return database;
    } catch (e) {
      console.log("Failed to connect to Mongo, error: " + e);
      process.exit(1);
    }
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

  async #produceData(data, collection) {
    try {

      let db = await this.#dbConnect();

      db.collection(collection).)

      await this.#channel.sendToQueue(this.#dbName, Buffer.from(JSON.stringify(data)));
      console.log(data);
    
    } catch (err) {
      console.log("Failed to send data to queue, error: " + err);
    }
  }


  async produce(data) {
    try {
      await this.#connectToQueue(this.#dbName);

      await this.#produceData(data);

    } catch (err) {
      console.log(err);
    }
  }

  async #consumeData(data) {
    try {
      // The function should 
      return data;
    } catch (err) {
      throw new Error(err);
    }
  }


  async consume(data) {
    try {
      //const dbInstance = new Database(this.#model);
      
      await this.#connectToQueue(this.#dbName);
      console.log("Listening for data");
      
      await this.#channel.consume(this.#dbName, 
      
      //JSON.parse(data.toString())
      //console.log("data consumed");
        
        async (message) => {

          const message = { data: data }; 
        
        //let parseData = JSON.parse(data.content);
        //const task = await #this.createTask(name, description)
        //await this.#consumeData(Buffer.from(JSON.parse(data)));
        //JSON.parse(data);
        
        this.#channel.ack(data);
      });

     //console.log(data.content);
    
    } catch (e) {
      console.log("Failed to consume, error: " + e);
      process.exit();
    }
  }
}


module.exports = rabbitMQ;



