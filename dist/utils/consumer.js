"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiveMessages = void 0;
const rabbitmq_1 = require("./rabbitmq");
// export const receiveMessages = async () => {
//     const { channel } = await connectRabbitMQ();
//     // Declare multiple queues
//     const queues = ["user_details_order_queue", "delete_class_user_queue"];
//     for (const queue of queues) {
//         await channel.assertQueue(queue, { durable: true });
//         console.log("🚀 Waiting for messages...");
//         channel.consume(queue, async (msg: any) => {
//             if (msg) {
//                 const receivedData = JSON.parse(msg.content.toString());
//                 console.log(`📩 Received: ${JSON.stringify(receivedData)}`);
//                 if (msg.properties.replyTo === 'delete_class_user_queue') {
//                     channel.sendToQueue("user_details_queue", Buffer.from(receivedData), {
//                         correlationId: msg.properties.correlationId
//                     });
//                 } else {
//                     processMessage(queue, receivedData);
//                 }
//                 // Acknowledge the message (removes from queue)
//                 channel.ack(msg);
//             }
//         }, { noAck: false });
//     }
// };
// const processMessage = async (queue: string, message: string) => {
//     // Implement your message processing logic here
//     if (queue === "delete_class_user_queue") {
//         await adminModel.updateMany({ classId: message }, { $unset: { classId: "" } });
//     }
// };
/**
 * Get message from simple queue/ Direct queues
 */
// export const receiveMessages = async () => {
//     const { channel } = await connectRabbitMQ();
//     const queue = "delete_class_user_queue"
//     await channel.assertQueue(queue, { durable: true });
//     console.log("🚀 Waiting for messages...");
//     channel.consume(queue, async (msg: any) => {
//         if (msg) {
//             const receivedData = JSON.parse(msg.content.toString());
//             console.log(`📩 Received: ${JSON.stringify(receivedData)}`, "queue", queue);
//             // Acknowledge the message (removes from queue)
//             channel.ack(msg);
//         }
//     }, { noAck: false });
// };
// /**
//  * Get message from topic
//  */
// export const receiveMessages = async () => {
//     const { channel } = await connectRabbitMQ();
//     const exchangeType = "topic"
//     const exchange = "class_delete_notification_usingTopic1";
//     const queue = "delete_class_user_queue"
//     await channel.assertExchange(exchange, exchangeType, { durable: true });
//     let topic = 'class.notification.toUser.*'
//     await channel.assertQueue(queue, { durable: true });
//     await channel.bindQueue(queue, exchange, topic)
//     console.log("🚀 Waiting for messages...");
//     channel.consume(queue, async (msg: any) => {
//         if (msg) {
//             const receivedData = JSON.parse(msg.content.toString());
//             console.log(`📩 Received: ${JSON.stringify(receivedData)}`, "queue", queue);
//             // Acknowledge the message (removes from queue)
//             channel.ack(msg);
//         }
//     }, { noAck: false });
// };
/**
 * Get message from fanout
 */
// export const receiveMessages = async () => {
//     const { channel } = await connectRabbitMQ();
//     const exchangeType = "fanout"
//     const exchange = "class_delete_notification_usingFanout";
//     await channel.assertExchange(exchange, exchangeType, { durable: true });
//     const queue = await channel.assertQueue('', { exclusive: true });
//     await channel.bindQueue(queue.queue, exchange, '')
//     console.log("🚀 Waiting for messages...");
//     channel.consume(queue.queue, async (msg: any) => {
//         if (msg) {
//             const receivedData = JSON.parse(msg.content.toString());
//             console.log(`📩 Received: ${JSON.stringify(receivedData)}`, "queue", queue);
//             // Acknowledge the message (removes from queue)
//             channel.ack(msg);
//         }
//     }, { noAck: false });
// };
/**
 * Get message from Headers
 */
// export const receiveMessages = async () => {
//     const { channel } = await connectRabbitMQ();
//     const exchangeType = "headers"
//     const exchange = "class_delete_notification_using_header_exchange";
//     await channel.assertExchange(exchange, exchangeType, { durable: true });
//     const queue = await channel.assertQueue('', { exclusive: true });
//     const headers = {
//         "x-match": 'all',
//         "notification-type": "class_notification_toUser",
//         "content-type": "notification"
//     }
//     await channel.bindQueue(queue.queue, exchange, '', headers)
//     console.log("🚀 Waiting for messages...");
//     channel.consume(queue.queue, async (msg: any) => {
//         if (msg) {
//             const receivedData = JSON.parse(msg.content.toString());
//             console.log(`📩 Received: ${JSON.stringify(receivedData)}`);
//             // Acknowledge the message (removes from queue)
//             channel.ack(msg);
//         }
//     }, { noAck: false });
// };
/**
 * Delayed Queue
 */
const receiveMessages = async () => {
    const { channel } = await (0, rabbitmq_1.connectRabbitMQ)();
    // Declare multiple queues
    const processingQueue = "processing_queue";
    await channel.assertQueue(processingQueue, { durable: true });
    console.log("🚀 Waiting for messages...");
    channel.consume(processingQueue, async (msg) => {
        if (msg) {
            const receivedData = JSON.parse(msg.content.toString());
            console.log(`📩 Received: ${JSON.stringify(receivedData)}`);
            // Acknowledge the message (removes from queue)
            channel.ack(msg);
        }
    }, { noAck: false });
};
exports.receiveMessages = receiveMessages;
