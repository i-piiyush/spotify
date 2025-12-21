import amqp from "amqplib";
import _config from "../config/config.js";
let connection, channel;
let isConnecting = false

export const connect = async () => {
  if (isConnecting) return;
  isConnecting = true;

  try {
    connection = await amqp.connect(_config.RABBITMQ_URI + "?heartbeat=30");

    connection.on("error", (err) => {
      console.error("RabbitMQ connection error:", err.message);
    });

    connection.on("close", () => {
      console.error("RabbitMQ connection closed. Reconnecting...");
      channel = null;
      connection = null;
      isConnecting = false;
      setTimeout(connect, 5000);
    });

    channel = await connection.createChannel();

    channel.on("error", (err) => {
      console.error("RabbitMQ channel error:", err.message);
    });

    channel.on("close", () => {
      console.error("RabbitMQ channel closed");
    });

    console.log("RabbitMQ connected");
  } catch (err) {
    console.error("RabbitMQ connection failed:", err.message);
    isConnecting = false;
    setTimeout(connect, 5000);
  }
};;

export const publishToQueue = async (queue_name, data) => {
  try {
    await channel.assertQueue(queue_name, { durable: true });
    await channel.sendToQueue(queue_name, Buffer.from(JSON.stringify(data)));
    console.log("Message sent to queue",queue_name);
  } catch (error) {
    console.log("Error publishing to queue :", error);
  }
};
