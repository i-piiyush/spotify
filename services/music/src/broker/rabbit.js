import amqp from "amqplib";
import _config from "../config/config.js";
let connection, channel;

export const connect = async () => {
  try {
    connection = await amqp.connect(_config.RABBITMQ_URI);
    channel = await connection.createChannel();

    console.log("RabbitMq is connected");
  } catch (error) {
    console.log("RabbitMQ Error: ", error);
  }
};

export const publishToQueue = async (queue_name, data) => {
  try {
    await channel.assertQueue(queue_name, { durable: true });
    await channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(data)));
    console.log("Message sent to queue",queue_name);
  } catch (error) {
    console.log("Error publishing to queue :", error);
  }
};
