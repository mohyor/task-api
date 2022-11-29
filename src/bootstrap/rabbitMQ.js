const amqp = require('amqplib/callback_api');
require("dotenv").config();

//const server = require('../app').server;

const app = require('express')();
const server = require('http').Server(app);

const { Server } = require("socket.io");
const io = new Server(server);

const socket = io.on('connection', (socket) => {
 console.log('Connected');
 socket.on("Disconnected", () => console.log(`${socket.id} User disconnected.`));
});

/*
exports.send = (queueName, data) => {

  amqp.connect(process.env.CLOUDAMQP_URL + "?heartbeat=60", function(error0, connection) {

   if (error0) {
    throw error0;
   }
  
   connection.createChannel(function(error1, channel) {
  
    if (error1) {
     throw error1;
    }
  
    let queue = queueName;
  
    channel.assertQueue(queue, { durable: false });
     
    channel.sendToQueue(queue, Buffer.from(data));
    
    console.log(`[x] ${queueName} Sent %s`, data);
   });
  
   setTimeout(function() {
    connection.close();
   }, 500);
   });
}
*/

const send = (queueName, data) => {

  amqp.connect(process.env.AMQP_URL + "?heartbeat=60", function(error0, connection) {

   if (error0) {
    throw error0;
   }
  
   connection.createChannel(function(error1, channel) {
  
    if (error1) {
     throw error1;
    }
  
    let queue = queueName;
  
    channel.assertQueue(queue, { durable: false });
     
    channel.sendToQueue(queue, Buffer.from(data));
    
    console.log(`[x] ${queueName} Sent %s`, data);
   });
  
   setTimeout(function() {
    connection.close();
   }, 500);
   });
}

module.exports = { socket, send }